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

  const isPlot = propertyType === "plot";
  const isCommercial = propertyType === "commercial";

  let specsText = `- Purpose: For ${listingType === "rent" ? "Rent / Lease" : "Sale"}
- Property Type: ${propertyType.replace("_", " ")}
${areaSqFt ? `- Area: ${Number(areaSqFt).toLocaleString()} sq.ft` : ""}
${price ? `- Price: ₹${Number(price).toLocaleString("en-IN")}` : ""}
- Locality / Sector: ${locality || "Prime residential hub"}
- City: ${city}
${currentTitle ? `- Current Working Title: ${currentTitle}` : ""}`;

  if (isPlot) {
    specsText += `
- Category Details: Freehold Residential / Commercial Plot
- Key Features: Clear legal title, road frontage, rapid appreciation corridor, bespoke construction readiness`;
  } else if (isCommercial) {
    specsText += `
${bathrooms ? `- Washrooms: ${bathrooms}` : ""}
- Furnishing / Fit-out Status: ${furnishing.replace("_", " ")}
- Key Features: Prime commercial viability, excellent transit connectivity, high visibility`;
  } else {
    specsText += `
- Configuration: ${bedrooms ? `${bedrooms} BHK` : "Spacious layout"}
${bathrooms ? `- Bathrooms: ${bathrooms}` : ""}
- Furnishing Status: ${furnishing.replace("_", " ")}`;
  }

  const prompt = `
You are an elite real estate copywriter and marketer for Dwellio, a premium real estate marketplace.
Write a compelling, sophisticated, and polished property listing description.

Property Specifications:
${specsText}

Writing Guidelines:
${
  isPlot
    ? "1. Opening Hook: Write an inspiring paragraph highlighting the plot's development potential, strategic location, road access, and building a bespoke dream residence/asset. NEVER mention bedrooms or interior furniture.\n2. Key Highlights Section: Create 3-5 concise bullet points highlighting road width, legal approvals, neighborhood growth, and connectivity.\n3. Call to Action: A welcoming closing line encouraging prospective land buyers/investors to schedule a site visit or enquire directly."
    : isCommercial
    ? "1. Opening Hook: Write a professional paragraph highlighting corporate presence, retail/office viability, footfall, modern infrastructure, and business connectivity. NEVER mention BHK.\n2. Key Highlights Section: Create 3-5 concise bullet points highlighting office fit-out, transit access, parking, and commercial amenities.\n3. Call to Action: A professional closing line encouraging business owners or investors to schedule a tour."
    : "1. Opening Hook: Write an inspiring, vivid paragraph highlighting the lifestyle, natural light, spatial layout, and prime neighborhood appeal.\n2. Key Highlights Section: Create 3-5 concise bullet points highlighting convenience, spatial design, transport connectivity, and daily amenities.\n3. Call to Action: A welcoming closing line encouraging prospective home seekers to schedule a viewing or enquire directly."
}
4. Output Format: Return ONLY clean text without meta-introductions like "Here is your description". Do NOT include placeholders like "[Your Phone Number]".
`;

  // Try reliable models in order of availability and low latency
  const modelsToTry = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.8-flash",
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const description = response.text().trim();
      if (description) {
        return { description };
      }
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
