const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Enquiry = sequelize.define(
  "Enquiry",
  {
    enquiryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("new", "contacted", "closed"),
      defaultValue: "new",
    },
  },
  {
    tableName: "enquiries",
    timestamps: true,
  }
);

module.exports = Enquiry;
