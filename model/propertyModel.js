const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Property = sequelize.define(
  "Property",
  {
    propertyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    listingType: {
      type: DataTypes.ENUM("sale", "rent"),
      allowNull: false,
      defaultValue: "sale",
    },
    propertyType: {
      type: DataTypes.ENUM("apartment", "villa", "independent_house", "plot", "commercial", "builder_floor"),
      allowNull: false,
      defaultValue: "apartment",
    },
    price: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    priceDisplay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    balconies: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    areaSqFt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    furnishing: {
      type: DataTypes.ENUM("unfurnished", "semi_furnished", "fully_furnished"),
      defaultValue: "semi_furnished",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    possessionStatus: {
      type: DataTypes.ENUM("ready_to_move", "under_construction"),
      defaultValue: "ready_to_move",
    },
    floorNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalFloors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parking: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM("available", "pending", "sold", "rented"),
      defaultValue: "available",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "properties",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Property;
