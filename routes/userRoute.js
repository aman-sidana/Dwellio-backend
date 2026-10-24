const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Authentication Endpoints (Public)
router.post("/users/register", userController.register);
router.post("/users/login", userController.login);
router.post("/users", userController.register); // Alias for backwards compatibility
router.post("/users/logout", userController.logout);
router.post("/users/forgot-password", userController.forgotPassword);
router.post("/users/reset-password", userController.resetPassword);

// Protected User Endpoints
router.get("/users/me", verifyToken, userController.getMe);

// Management Endpoints
router.get("/users", verifyToken, authorizeRoles("super_admin"), userController.getAllUsers);
router.get("/users/:id", verifyToken, userController.getUserById);
router.put("/users/:id", verifyToken, userController.updateUser);
router.delete("/users/:id", verifyToken, authorizeRoles("super_admin"), userController.deleteUser);

module.exports = router;
