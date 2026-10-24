const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const PropertyImage = sequelize.define(
  "PropertyImage",
  {
    imageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "property_images",
    timestamps: true,
  }
);

module.exports = PropertyImage;
