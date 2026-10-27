const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// 1. Multer Memory Storage (Parse incoming multipart image files into memory buffers)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Please upload JPEG, PNG, WEBP, or GIF images."), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per image limit
    files: 10,                  // Up to 10 images at once
  },
  fileFilter,
});

// 2. Cloudinary Upload Controller Function
const uploadImages = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided for upload",
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary credentials are not configured in backend/.env",
      });
    }

    // Stream each buffer to Cloudinary
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "dwellio/properties",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: `${urls.length} image(s) uploaded successfully to Cloudinary`,
      data: {
        urls,
        primaryUrl: urls[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  uploadImages,
};
