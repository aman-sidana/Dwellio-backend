const enquiryRepository = require("../repository/enquiryRepository");
const propertyRepository = require("../repository/propertyRepository");

const createEnquiry = async (enquiryData) => {
  const { propertyId, name, email, phone } = enquiryData;

  if (!propertyId || !name || !email || !phone) {
    throw new Error("Property ID, name, email, and phone number are required");
  }

  const property = await propertyRepository.findPropertyById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  return await enquiryRepository.createEnquiry(enquiryData);
};

const getEnquiriesForProperty = async (propertyId) => {
  return await enquiryRepository.findEnquiriesByPropertyId(propertyId);
};

const getEnquiriesForUser = async (userId) => {
  return await enquiryRepository.findEnquiriesByUserId(userId);
};

const updateStatus = async (enquiryId, status) => {
  const enquiry = await enquiryRepository.findEnquiryById(enquiryId);
  if (!enquiry) {
    throw new Error("Enquiry not found");
  }
  await enquiryRepository.updateEnquiryStatus(enquiryId, status);
  return await enquiryRepository.findEnquiryById(enquiryId);
};

module.exports = {
  createEnquiry,
  getEnquiriesForProperty,
  getEnquiriesForUser,
  updateStatus,
};
