require("dotenv").config();
const app = require("./app");
const sequelize = require("./db/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Authenticate connection with MySQL database
    await sequelize.authenticate();
    console.log("==================================================");
    console.log("✅ MySQL Database connected successfully via Sequelize!");
    console.log(`📡 Host: ${process.env.DB_HOST}`);
    console.log(`📦 Database: ${process.env.DB_NAME}`);
    console.log("==================================================");

    // 2. Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Dwellio Backend is running on: http://localhost:${PORT}`);
      // console.log(`🩺 Health check URL: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MySQL database:", error.message);
    process.exit(1);
  }
};

startServer();