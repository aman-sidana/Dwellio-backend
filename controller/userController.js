const userService = require("../service/userService");

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const { user, token } = await userService.registerUser({
      name,
      email,
      password,
      phone,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Welcome to Dwellio!",
      data: user,
      token,
    });
  } catch (error) {
    const status = error.message.includes("super_admin")
      ? 403
      : error.message.includes("already registered")
        ? 409
        : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const { user, token } = await userService.loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: user,
      token,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials.",
    });
  }
};

// GET /api/users/me (Authenticated user profile)
const getMe = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/users (Admin / Management)
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required.",
      });
    }

    const user = await userService.getUserById(id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required.",
      });
    }

    const user = await userService.updateUser(id, req.body);
    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required.",
      });
    }

    await userService.deleteUser(id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/users/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.sendForgotPasswordOtp(email);
    return res.status(200).json(result);
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/users/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    const result = await userService.resetPasswordWithOtp({
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return res.status(200).json(result);
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/users/theme
const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme || !["light", "dark"].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: "Theme must be either 'light' or 'dark'.",
      });
    }

    const updatedUser = await userService.updateUserTheme(req.user.userId, theme);
    return res.status(200).json({
      success: true,
      message: `Theme updated to ${theme}`,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateTheme,
};