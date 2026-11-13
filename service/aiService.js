const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generate an enticing, professional real estate description using Google Gemini
 */
const generatePropertyDescription = async (details = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "Gemini API Key is missing. Please add GEMINI_API_KEY to your backend/.env file."
    );
  }

  const {
    propertyType = "apartment",
    bedrooms,
    bathrooms,
    city = "Mumbai",
    locality = "",
    areaSqFt,
    price,
    furnishing = "semi_furnished",
    listingType = "sale",
    currentTitle = "",
  } = details;

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
You are an elite real estate copywriter and marketer for Dwellio, a premium real estate marketplace.
Write a compelling, sophisticated, and polished property listing description.

Property Specifications:
- Purpose: For ${listingType === "rent" ? "Rent / Lease" : "Sale"}
- Property Type: ${propertyType.replace("_", " ")}
- Configuration: ${bedrooms ? `${bedrooms} BHK` : "Spacious layout"}
${bathrooms ? `- Bathrooms: ${bathrooms}` : ""}
${areaSqFt ? `- Carpet / Built-up Area: ${Number(areaSqFt).toLocaleString()} sq.ft` : ""}
${price ? `- Price: ₹${Number(price).toLocaleString("en-IN")}` : ""}
- Furnishing Status: ${furnishing.replace("_", " ")}
- Locality / Sector: ${locality || "Prime residential hub"}
- City: ${city}
${currentTitle ? `- Current Working Title: ${currentTitle}` : ""}

Writing Guidelines:
1. Opening Hook: Write an inspiring, vivid paragraph highlighting the lifestyle, natural light, spatial layout, and prime neighborhood appeal.
2. Key Highlights Section: Create 3-5 concise bullet points highlighting convenience, spatial design, transport connectivity, and daily amenities.
3. Call to Action: A welcoming closing line encouraging prospective ${listingType === "rent" ? "tenants" : "homebuyers"} to schedule a viewing or enquire directly.
4. Output Format: Return ONLY clean text without meta-introductions like "Here is your description". Do NOT include placeholders like "[Your Phone Number]".
`;

  // Try reliable models in order of availability
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.8-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const description = response.text().trim();
      return { description };
    } catch (err) {
      lastError = err;
      // continue to next model on fallback
    }
  }

  throw new Error(`Failed to generate description: ${lastError ? lastError.message : "Unknown error"}`);
};

module.exports = {
  generatePropertyDescription,
};
