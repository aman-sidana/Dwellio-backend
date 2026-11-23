const { Favorite, Property, PropertyImage } = require("../model");
const { Op } = require("sequelize");

const addFavorite = async (userId, propertyId) => {
  const [favorite, created] = await Favorite.findOrCreate({
    where: { userId, propertyId },
  });
  return { favorite, created };
};

const removeFavorite = async (userId, propertyId) => {
  return await Favorite.destroy({
    where: { userId, propertyId },
  });
};

const findFavoritesByUser = async (userId) => {
  return await Favorite.findAll({
    where: { userId },
    include: [
      {
        model: Property,
        as: "property",
        include: [
          {
            model: PropertyImage,
            as: "images",
            attributes: ["imageUrl", "isPrimary"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const isFavorite = async (userId, propertyId) => {
  const fav = await Favorite.findOne({ where: { userId, propertyId } });
  return !!fav;
};

const countFavoritesByOwner = async (userId) => {
  const userProps = await Property.findAll({
    where: { userId },
    attributes: ["propertyId"],
  });
  const propIds = userProps.map((p) => p.propertyId);
  if (propIds.length === 0) return 0;
  return await Favorite.count({
    where: { propertyId: { [Op.in]: propIds } },
  });
};

module.exports = {
  addFavorite,
  removeFavorite,
  findFavoritesByUser,
  isFavorite,
  countFavoritesByOwner,
};
