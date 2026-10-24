const favoriteRepository = require("../repository/favoriteRepository");
const propertyRepository = require("../repository/propertyRepository");

const toggleFavorite = async (userId, propertyId) => {
  if (!userId || !propertyId) {
    throw new Error("userId and propertyId are required");
  }

  const property = await propertyRepository.findPropertyById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  const alreadySaved = await favoriteRepository.isFavorite(userId, propertyId);
  if (alreadySaved) {
    await favoriteRepository.removeFavorite(userId, propertyId);
    return { favorited: false, message: "Property removed from saved favorites" };
  } else {
    await favoriteRepository.addFavorite(userId, propertyId);
    return { favorited: true, message: "Property saved to favorites" };
  }
};

const getUserFavorites = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  return await favoriteRepository.findFavoritesByUser(userId);
};

const checkIsFavorite = async (userId, propertyId) => {
  return await favoriteRepository.isFavorite(userId, propertyId);
};

module.exports = {
  toggleFavorite,
  getUserFavorites,
  checkIsFavorite,
};
