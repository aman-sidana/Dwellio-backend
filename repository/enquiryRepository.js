const { Enquiry, Property, User } = require("../model");

const createEnquiry = async (enquiryData) => {
  return await Enquiry.create(enquiryData);
};

const findEnquiryById = async (id) => {
  return await Enquiry.findByPk(id, {
    include: [
      {
        model: Property,
        as: "property",
        attributes: ["propertyId", "title", "priceDisplay", "city", "locality"],
      },
    ],
  });
};

const findEnquiriesByPropertyId = async (propertyId) => {
  return await Enquiry.findAll({
    where: { propertyId },
    order: [["createdAt", "DESC"]],
  });
};

const findEnquiriesByUserId = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return [];

  // Super admin: sees all enquiries across Dwellio
  if (user.role === "super_admin") {
    return await Enquiry.findAll({
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["propertyId", "title", "priceDisplay", "city", "locality", "listingType"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Owner / Broker: sees enquiries received for their properties
  if (user.role === "owner" || user.role === "broker") {
    return await Enquiry.findAll({
      include: [
        {
          model: Property,
          as: "property",
          where: { userId },
          attributes: ["propertyId", "title", "priceDisplay", "city", "locality", "listingType"],
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Regular buyer: sees enquiries they submitted
  return await Enquiry.findAll({
    where: { userId },
    include: [
      {
        model: Property,
        as: "property",
        attributes: ["propertyId", "title", "priceDisplay", "city", "locality", "listingType"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const updateEnquiryStatus = async (enquiryId, status) => {
  const [updatedRows] = await Enquiry.update({ status }, { where: { enquiryId } });
  return updatedRows;
};

module.exports = {
  createEnquiry,
  findEnquiryById,
  findEnquiriesByPropertyId,
  findEnquiriesByUserId,
  updateEnquiryStatus,
};
