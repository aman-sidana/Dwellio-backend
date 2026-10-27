const { Property, User, PropertyImage } = require("../model");
const { Sequelize, Op } = require("sequelize");

const getAdminStats = async (req, res) => {
  try {
    // 1. Property statistics
    const totalProperties = await Property.count();
    const soldProperties = await Property.count({ where: { status: "sold" } });
    const availableProperties = await Property.count({ where: { status: "available" } });
    const rentedProperties = await Property.count({ where: { status: "rented" } });
    const pendingProperties = await Property.count({ where: { status: "pending" } });

    // Calculate total value of sold properties & total listings value
    const soldPriceSum = (await Property.sum("price", { where: { status: "sold" } })) || 0;
    const totalPriceSum = (await Property.sum("price")) || 0;

    // 2. User statistics grouped by role (excluding super_admin from public stakeholder totals)
    const totalUsers = await User.count({ where: { role: { [Op.ne]: "super_admin" } } });
    const ownerCount = await User.count({ where: { role: "owner" } });
    const brokerCount = await User.count({ where: { role: "broker" } });
    const regularUserCount = await User.count({ where: { role: "user" } });
    const superAdminCount = await User.count({ where: { role: "super_admin" } });

    // 3. Recent 5 Properties with owner info
    const recentProperties = await Property.findAll({
      limit: 6,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["userId", "name", "email", "phone", "role"],
        },
        {
          model: PropertyImage,
          as: "images",
          attributes: ["imageUrl", "isPrimary"],
          limit: 1,
        },
      ],
    });

    // 4. Recent 6 Registered Stakeholders (excluding super_admin)
    const recentUsers = await User.findAll({
      where: {
        role: { [Op.ne]: "super_admin" },
      },
      limit: 6,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password", "otp", "otpExpires"] },
    });

    return res.status(200).json({
      success: true,
      data: {
        properties: {
          total: totalProperties,
          sold: soldProperties,
          available: availableProperties,
          rented: rentedProperties,
          pending: pendingProperties,
          soldValue: soldPriceSum,
          totalValue: totalPriceSum,
        },
        users: {
          total: totalUsers,
          owners: ownerCount,
          brokers: brokerCount,
          regularUsers: regularUserCount,
          superAdmins: superAdminCount,
        },
        recentProperties,
        recentUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};
