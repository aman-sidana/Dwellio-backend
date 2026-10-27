const jwt = require("jsonwebtoken");
const enquiryService = require("../service/enquiryService");

const createEnquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone } = req.body;

    if (!propertyId || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Property ID, name, email, and phone are required",
      });
    }

    // Attach buyer userId if logged in
    let userId = req.body.userId || null;
    if (!userId && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "Dwellio_jwt_secret_super_secure_key_2026"
        );
        userId = decoded.userId;
      } catch (e) {}
    }

    const enquiry = await enquiryService.createEnquiry({ ...req.body, userId });

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. The owner/agent will contact you shortly.",
      data: enquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPropertyEnquiries = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const enquiries = await enquiryService.getEnquiriesForProperty(propertyId);

    return res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserEnquiries = async (req, res) => {
  try {
    const { userId } = req.params;
    const enquiries = await enquiryService.getEnquiriesForUser(userId);

    return res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updated = await enquiryService.updateStatus(id, status);

    return res.status(200).json({
      success: true,
      message: "Enquiry status updated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEnquiry,
  getPropertyEnquiries,
  getUserEnquiries,
  updateStatus,
};
