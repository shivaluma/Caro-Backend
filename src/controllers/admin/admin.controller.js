const { AdminService, ResponseService } = require('../../services');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await AdminService.getAllUsers();
    return res.status(200).json(ResponseService.response(200, null, users));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get all users', error));
  }
};

exports.getAllHistory = async (req, res) => {
  try {
    const history = await AdminService.getAllHistory();
    return res.status(200).json(ResponseService.response(200, null, history));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get all history', error));
  }
};
exports.getHistoryByUserId = () => {};

exports.getChatByMatchId = () => {};

exports.searchUser = () => {};
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await AdminService.getUserById(userId);
    return res.status(200).json(ResponseService.response(200, null, user));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not find this user', error));
  }
};
exports.updateUserById = () => {};
