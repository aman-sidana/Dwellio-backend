const { Sequelize } = require("sequelize");
require("dotenv").config();

const isAivenOrCloud =
  process.env.DB_SSL === "true" ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com"));

const dialectOptions = isAivenOrCloud
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "defaultdb",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      dialect: process.env.DB_DIALECT || "mysql",
      logging: false,
      dialectOptions,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;

