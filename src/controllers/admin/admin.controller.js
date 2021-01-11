const { AdminService, ResponseService } = require('../../services');

exports.getAllUsers = (req, res) => {
  const users = AdminService.getAllUsers();
  return res.status(200).json(ResponseService.response(200, null, users));
};

exports.getAllHistory = () => {};
exports.getHistoryByUserId = () => {};

exports.getChatByMatchId = () => {};

exports.searchUser = () => {};
exports.getUserById = () => {};
exports.updateUserById = () => {};
