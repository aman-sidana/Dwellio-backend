const jwt = require("jsonwebtoken");
const userRepository = require("../repository/userRepository");

const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization Header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a Bearer token in Authorization header.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dwellio_jwt_secret_super_secure_key_2026"
    );

    const user = await userRepository.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session is invalid. The user account no longer exists.",
      });
    }

    // Attach safe user object to request
    const userJson = user.toJSON();
    delete userJson.password;
    req.user = userJson;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token. Access denied.",
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(", ")}]. Your role is '${req.user.role}'.`,
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
};
