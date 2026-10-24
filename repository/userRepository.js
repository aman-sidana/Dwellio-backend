const User = require("../model/userModel");

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserById = async (id) => {
  return await User.findByPk(id);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const findAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password"] }
  });
};

const updateUser = async (userId, userData) => {
  const [updatedRows] = await User.update(userData, { where: { userId } });
  return updatedRows;
};

const deleteUser = async (userId) => {
  return await User.destroy({ where: { userId } });
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findAllUsers,
  updateUser,
  deleteUser,
};
