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
const adminRoutes = require("./routes/adminRoute");
const uploadRoutes = require("./routes/uploadRoute");
const aiRoutes = require("./routes/aiRoute");

const app = express();

// Global Middlewares
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all during setup to prevent CORS blocks
    },
    credentials: true,
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
app.use("/api", uploadRoutes);
app.use("/api", aiRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
