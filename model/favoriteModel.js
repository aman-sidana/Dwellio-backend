const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Favorite = sequelize.define(
  "Favorite",
  {
    favoriteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "favorites",
    timestamps: true,
  }
);

module.exports = Favorite;
