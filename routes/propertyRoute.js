const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Public browsing routes (No login required)
router.get("/properties/featured", propertyController.getFeaturedProperties);
router.get("/properties/amenities", propertyController.getAmenities);
router.get("/properties", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getPropertyById);

// Protected routes (Requires authentication + owner, broker, or super_admin role)
router.post(
  "/properties",
  verifyToken,
  authorizeRoles("owner", "broker", "super_admin"),
  propertyController.createProperty
);
router.put(
  "/properties/:id",
  verifyToken,
  authorizeRoles("owner", "broker", "super_admin"),
  propertyController.updateProperty
);
router.delete(
  "/properties/:id",
  verifyToken,
  authorizeRoles("owner", "broker", "super_admin"),
  propertyController.deleteProperty
);

module.exports = router;
