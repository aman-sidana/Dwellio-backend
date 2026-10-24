const propertyService = require("../service/propertyService");

const createProperty = async (req, res) => {
  try {
    const userId = (req.user && req.user.userId) || req.body.userId;
    const { title, price, city, locality, areaSqFt } = req.body;

    if (!userId || !title || !price || !city || !locality || !areaSqFt) {
      return res.status(400).json({
        success: false,
        message: "userId, title, price, city, locality, and areaSqFt are required",
      });
    }

    const property = await propertyService.createProperty({
      ...req.body,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid property ID is required",
      });
    }

    const property = await propertyService.getPropertyById(id);

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const result = await propertyService.getProperties(req.query);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeaturedProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const properties = await propertyService.getFeaturedProperties(limit);

    return res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid property ID is required",
      });
    }

    const existingProperty = await propertyService.getPropertyById(id);
    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Ownership check: Super Admins can update any property, owners/brokers only their own
    if (req.user && req.user.role !== "super_admin" && existingProperty.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to update this property.",
      });
    }

    const property = await propertyService.updateProperty(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid property ID is required",
      });
    }

    const existingProperty = await propertyService.getPropertyById(id);
    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Ownership check: Super Admins can delete any property, owners/brokers only their own
    if (req.user && req.user.role !== "super_admin" && existingProperty.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this property.",
      });
    }

    await propertyService.deleteProperty(id);

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getAmenities = async (req, res) => {
  try {
    const amenities = await propertyService.getAllAmenities();

    return res.status(200).json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProperty,
  getPropertyById,
  getAllProperties,
  getFeaturedProperties,
  updateProperty,
  deleteProperty,
  getAmenities,
};
