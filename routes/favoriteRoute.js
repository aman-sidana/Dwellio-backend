const express = require("express");
const router = express.Router();
const favoriteController = require("../controller/favoriteController");
const { verifyToken } = require("../middleware/authMiddleware");

// Protected routes: users must be authenticated to save or view favorites
router.post("/favorites/toggle", verifyToken, favoriteController.toggleFavorite);
router.get("/favorites/user/:userId", verifyToken, favoriteController.getUserFavorites);

// Public favorite status check
router.get("/favorites/check", favoriteController.checkStatus);

module.exports = router;
