const express = require("express");
const cors = require("cors");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");

// Load models and associations
require("./model");

// Load routes
const userRoutes = require("./routes/userRoute");
const propertyRoutes = require("./routes/propertyRoute");
const enquiryRoutes = require("./routes/enquiryRoute");
const favoriteRoutes = require("./routes/favoriteRoute");

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dwellio Real Estate API is operational",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Root welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Dwellio Real Estate API",
    healthCheckUrl: "/api/health",
  });
});

// Mount API Routes
app.use("/api", userRoutes);
app.use("/api", propertyRoutes);
app.use("/api", enquiryRoutes);
app.use("/api", favoriteRoutes);

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
