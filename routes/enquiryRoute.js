const express = require("express");
const router = express.Router();
const enquiryController = require("../controller/enquiryController");

router.post("/enquiries", enquiryController.createEnquiry);
router.get("/enquiries/property/:propertyId", enquiryController.getPropertyEnquiries);
router.get("/enquiries/user/:userId", enquiryController.getUserEnquiries);
router.patch("/enquiries/:id/status", enquiryController.updateStatus);

module.exports = router;
