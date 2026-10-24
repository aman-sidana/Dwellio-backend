const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Amenity = sequelize.define(
  "Amenity",
  {
    amenityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "amenities",
    timestamps: true,
  }
);

module.exports = Amenity;
