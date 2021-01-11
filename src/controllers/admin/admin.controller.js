const { AdminService, ResponseService } = require('../../services');

exports.getAllUsers = (req, res) => {
  try {
    const users = AdminService.getAllUsers();
    return res.status(200).json(ResponseService.response(200, null, users));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get all users', error));
  }
};

exports.getAllHistory = () => {};
exports.getHistoryByUserId = () => {};

exports.getChatByMatchId = () => {};

exports.searchUser = () => {};
exports.getUserById = (req, res) => {
  try {
    const { userId } = req.params;
    const user = AdminService.getUserById(userId);
    return res.status(200).json(ResponseService.response(200, null, user));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not find this user', error));
  }
};
exports.updateUserById = () => {};
