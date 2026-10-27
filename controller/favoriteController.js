const favoriteService = require("../service/favoriteService");

const toggleFavorite = async (req, res) => {
  try {
    const userId = (req.user && req.user.userId) || req.body.userId;
    const { propertyId } = req.body;

    if (!userId || !propertyId) {
      return res.status(400).json({
        success: false,
        message: "userId and propertyId are required",
      });
    }

    const result = await favoriteService.toggleFavorite(userId, propertyId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const requestedUserId = parseInt(req.params.userId, 10);

    if (!requestedUserId || isNaN(requestedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required",
      });
    }

    // Ensure users can only view their own saved properties unless super_admin
    if (req.user && req.user.role !== "super_admin" && req.user.userId !== requestedUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view another user's saved properties.",
      });
    }

    const favorites = await favoriteService.getUserFavorites(requestedUserId);

    return res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const jwt = require("jsonwebtoken");

const checkStatus = async (req, res) => {
  try {
    let userId = req.query.userId;
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!userId && token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "dwellio_jwt_secret_super_secure_key_2026"
        );
        userId = decoded.userId;
      } catch (e) {
        // invalid token
      }
    }

    if (!userId || !req.query.propertyId) {
      return res.status(200).json({
        success: true,
        data: { isFavorite: false },
      });
    }

    const isFav = await favoriteService.checkIsFavorite(userId, req.query.propertyId);

    return res.status(200).json({
      success: true,
      data: { isFavorite: isFav },
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      data: { isFavorite: false },
    });
  }
};

module.exports = {
  toggleFavorite,
  getUserFavorites,
  checkStatus,
};
