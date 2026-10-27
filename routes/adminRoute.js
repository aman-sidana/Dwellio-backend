const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// All admin endpoints require authentication and super_admin role
router.get("/stats", verifyToken, authorizeRoles("super_admin"), adminController.getAdminStats);

module.exports = router;
