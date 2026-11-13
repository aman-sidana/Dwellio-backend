const aiService = require("../service/aiService");

/**
 * Controller to generate property marketing descriptions using Gemini AI
 */
const generatePropertyDescription = async (req, res) => {
  try {
    const result = await aiService.generatePropertyDescription(req.body);

    return res.status(200).json({
      success: true,
      message: "AI description generated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI description",
    });
  }
};

module.exports = {
  generatePropertyDescription,
};

