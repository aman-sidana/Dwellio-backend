const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repository/userRepository");
const emailService = require("./emailservice");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const normalizePublicRole = (role) => {
  if (!role) return "user";
  const r = role.toLowerCase().trim();
  if (r === "super_admin" || r === "admin") {
    throw new Error("Public registration as super_admin is not allowed.");
  }
  if (["owner", "seller", "landlord"].includes(r)) return "owner";
  if (["broker", "agent", "realtor"].includes(r)) return "broker";
  return "user";
};

const registerUser = async (userData) => {
  const { name, email, password, phone, role } = userData;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email is already registered. Please log in instead.");
  }

  const assignedRole = normalizePublicRole(role);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await userRepository.createUser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    phone: phone ? phone.trim() : null,
    role: assignedRole,
  });

  const userJson = newUser.toJSON();
  delete userJson.password;

  const token = jwt.sign(
    { userId: userJson.userId, email: userJson.email, role: userJson.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Send branded welcome email via Brevo asynchronously (non-blocking)
  emailService
    .sendWelcomeEmail(userJson.email, userJson.name, userJson.role)
    .catch((err) => console.error("⚠️ Welcome email failed to send:", err.message));

  return { user: userJson, token };
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await userRepository.findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const userJson = user.toJSON();
  delete userJson.password;

  const token = jwt.sign(
    { userId: userJson.userId, email: userJson.email, role: userJson.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { user: userJson, token };
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error("User not found.");
  }
  const userJson = user.toJSON();
  delete userJson.password;
  return userJson;
};

const getAllUsers = async () => {
  return await userRepository.findAllUsers();
};

const updateUser = async (id, userData) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error("User not found.");
  }

  if (userData.password) {
    if (userData.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }

  await userRepository.updateUser(id, userData);
  const updatedUser = await userRepository.findUserById(id);
  const userJson = updatedUser.toJSON();
  delete userJson.password;
  return userJson;
};

const deleteUser = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error("User not found.");
  }
  return await userRepository.deleteUser(id);
};

// Send OTP to email for password reset
const sendForgotPasswordOtp = async (email) => {
  if (!email) {
    throw new Error("Email address is required.");
  }

  const user = await userRepository.findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new Error("User not found with this email.");
  }

  const generatedOtp = emailService.otp();

  // Save OTP and 5-minute expiration
  user.otp = String(generatedOtp);
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  // Send OTP email via Brevo
  await emailService.sendOtpEmail(user.email, generatedOtp);

  return {
    success: true,
    message: "Password reset OTP has been sent to your email.",
  };
};

// Verify OTP and reset password
const resetPasswordWithOtp = async ({ email, otp, newPassword, confirmPassword }) => {
  if (!email || !otp || !newPassword || !confirmPassword) {
    throw new Error("Email, OTP, new password, and confirmation password are required.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirm password do not match.");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const user = await userRepository.findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.otp || String(user.otp) !== String(otp)) {
    throw new Error("Invalid OTP code. Please check and try again.");
  }

  if (!user.otpExpires || new Date() > new Date(user.otpExpires)) {
    throw new Error("OTP has expired. Please request a new OTP.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return {
    success: true,
    message: "Password changed successfully. Please log in with your new password.",
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
};
