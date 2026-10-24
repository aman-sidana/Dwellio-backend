const propertyRepository = require("../repository/propertyRepository");
const userRepository = require("../repository/userRepository");

const formatPriceDisplay = (price, listingType) => {
  const num = Number(price);
  if (isNaN(num)) return price;
  if (listingType === "rent") {
    return `₹${num.toLocaleString("en-IN")}/mo`;
  }
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lac`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
};

const createProperty = async (propertyData) => {
  const { userId, title, price, listingType = "sale", city, locality, areaSqFt, images, amenityIds } = propertyData;

  if (!userId || !title || !price || !city || !locality || !areaSqFt) {
    throw new Error("Missing required property fields: userId, title, price, city, locality, areaSqFt");
  }

  const owner = await userRepository.findUserById(userId);
  if (!owner) {
    throw new Error("Owner user does not exist");
  }

  const priceDisplay = propertyData.priceDisplay || formatPriceDisplay(price, listingType);

  const newProperty = await propertyRepository.createProperty({
    ...propertyData,
    priceDisplay,
  });

  // Attach images if provided
  if (images && Array.isArray(images) && images.length > 0) {
    const imagesToInsert = images.map((img, idx) => ({
      propertyId: newProperty.propertyId,
      imageUrl: typeof img === "string" ? img : img.imageUrl,
      isPrimary: idx === 0,
    }));
    await propertyRepository.addPropertyImages(imagesToInsert);
  }

  // Attach amenities if provided
  if (amenityIds && Array.isArray(amenityIds) && amenityIds.length > 0) {
    await newProperty.setAmenities(amenityIds);
  }

  return await propertyRepository.findPropertyById(newProperty.propertyId);
};

const getPropertyById = async (id) => {
  const property = await propertyRepository.findPropertyById(id);
  if (!property) {
    throw new Error("Property not found");
  }
  // increment view count asynchronously
  propertyRepository.incrementViews(id).catch(() => {});
  return property;
};

const getProperties = async (queryParams) => {
  const { page = 1, limit = 12, ...filters } = queryParams;
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  const { total, properties } = await propertyRepository.findProperties({
    ...filters,
    limit: parseInt(limit, 10),
    offset,
  });

  return {
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / parseInt(limit, 10)),
    limit: parseInt(limit, 10),
    properties,
  };
};

const getFeaturedProperties = async (limit = 6) => {
  return await propertyRepository.findFeaturedProperties(limit);
};

const updateProperty = async (id, propertyData) => {
  const property = await propertyRepository.findPropertyById(id);
  if (!property) {
    throw new Error("Property not found");
  }

  if (propertyData.price || propertyData.listingType) {
    const price = propertyData.price || property.price;
    const listingType = propertyData.listingType || property.listingType;
    propertyData.priceDisplay = formatPriceDisplay(price, listingType);
  }

  await propertyRepository.updateProperty(id, propertyData);

  if (propertyData.amenityIds && Array.isArray(propertyData.amenityIds)) {
    await property.setAmenities(propertyData.amenityIds);
  }

  return await propertyRepository.findPropertyById(id);
};

const deleteProperty = async (id) => {
  const property = await propertyRepository.findPropertyById(id);
  if (!property) {
    throw new Error("Property not found");
  }
  return await propertyRepository.deleteProperty(id);
};

const getAllAmenities = async () => {
  return await propertyRepository.findAllAmenities();
};

module.exports = {
  createProperty,
  getPropertyById,
  getProperties,
  getFeaturedProperties,
  updateProperty,
  deleteProperty,
  getAllAmenities,
};
