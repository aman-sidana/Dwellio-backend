const { Property, PropertyImage, Amenity, User } = require("../model");
const { Op } = require("sequelize");

const createProperty = async (propertyData) => {
  return await Property.create(propertyData);
};

const findPropertyById = async (id) => {
  return await Property.findByPk(id, {
    include: [
      {
        model: PropertyImage,
        as: "images",
        attributes: ["imageId", "imageUrl", "isPrimary"],
      },
      {
        model: Amenity,
        as: "amenities",
        attributes: ["amenityId", "name", "icon"],
        through: { attributes: [] },
      },
      {
        model: User,
        as: "owner",
        attributes: ["userId", "name", "email", "phone", "role"],
      },
    ],
  });
};

const findProperties = async (filters = {}) => {
  const {
    city,
    locality,
    listingType,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    furnishing,
    search,
    limit = 12,
    offset = 0,
    sortBy = "createdAt",
    sortOrder = "DESC",
  } = filters;

  const where = {
    status: "available",
  };

  if (filters.userId) {
    where.userId = parseInt(filters.userId, 10);
  }

  if (city) {
    where.city = { [Op.like]: `%${city}%` };
  }

  if (locality) {
    where.locality = { [Op.like]: `%${locality}%` };
  }

  if (listingType) {
    where.listingType = listingType;
  }

  if (propertyType) {
    where.propertyType = propertyType;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  if (bedrooms) {
    where.bedrooms = parseInt(bedrooms, 10);
  }

  if (furnishing) {
    where.furnishing = furnishing;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { city: { [Op.like]: `%${search}%` } },
      { locality: { [Op.like]: `%${search}%` } },
      { propertyType: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Property.findAndCountAll({
    where,
    include: [
      {
        model: PropertyImage,
        as: "images",
        attributes: ["imageId", "imageUrl", "isPrimary"],
      },
      {
        model: Amenity,
        as: "amenities",
        attributes: ["amenityId", "name", "icon"],
        through: { attributes: [] },
      },
      {
        model: User,
        as: "owner",
        attributes: ["userId", "name", "email", "phone", "role"],
      },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [[sortBy, sortOrder.toUpperCase()]],
    distinct: true,
  });

  return { total: count, properties: rows };
};

const findFeaturedProperties = async (limit = 6) => {
  return await Property.findAll({
    where: {
      status: "available",
      featured: true,
    },
    include: [
      {
        model: PropertyImage,
        as: "images",
        attributes: ["imageId", "imageUrl", "isPrimary"],
      },
      {
        model: User,
        as: "owner",
        attributes: ["userId", "name", "phone"],
      },
    ],
    limit: parseInt(limit, 10) || 6,
    order: [["createdAt", "DESC"]],
  });
};

const updateProperty = async (propertyId, propertyData) => {
  const [updatedRows] = await Property.update(propertyData, {
    where: { propertyId },
  });
  return updatedRows;
};

const deleteProperty = async (propertyId) => {
  return await Property.destroy({ where: { propertyId } });
};

const addPropertyImages = async (imagesData) => {
  return await PropertyImage.bulkCreate(imagesData);
};

const findAllAmenities = async () => {
  return await Amenity.findAll();
};

const incrementViews = async (propertyId) => {
  return await Property.increment("viewsCount", { by: 1, where: { propertyId } });
};

module.exports = {
  createProperty,
  findPropertyById,
  findProperties,
  findFeaturedProperties,
  updateProperty,
  deleteProperty,
  addPropertyImages,
  findAllAmenities,
  incrementViews,
};
