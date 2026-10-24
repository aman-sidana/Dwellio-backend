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
  return await Enquiry.findAll({
    where: { userId },
    include: [
      {
        model: Property,
        as: "property",
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
