const express = require("express");
const router = express.Router();
const { upload, uploadImages } = require("../controller/uploadController");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/upload - Accepts up to 10 images and uploads directly to Cloudinary
router.post(
  "/upload",
  verifyToken,
  upload.array("images", 10),
  uploadImages
);

module.exports = router;
