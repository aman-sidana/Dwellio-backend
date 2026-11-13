const express = require("express");
const router = express.Router();
const aiController = require("../controller/aiController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// POST /api/ai/property-description
router.post(
  "/property-description",
  verifyToken,
  authorizeRoles("owner", "broker", "super_admin"),
  aiController.generatePropertyDescription
);

// Backward compatibility alias: POST /api/ai/description
router.post(
  "/description",
  verifyToken,
  authorizeRoles("owner", "broker", "super_admin"),
  aiController.generatePropertyDescription
);

module.exports = router;

