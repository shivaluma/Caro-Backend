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
    const histories = await AdminService.getAllHistory();
    return res.status(200).json(ResponseService.response(200, null, histories));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get all histories', error));
  }
};
exports.getHistoryByUserId = () => {};

exports.getChatByMatchId = async (req, res) => {
  const { matchId } = req.params;
  try {
    const chat = await AdminService.getChatByMatchId(matchId);
    return res.status(200).json(ResponseService.response(200, null, chat));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get this chat history', error));
  }
};

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
exports.updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user } = req.body;
    const updated = AdminService.updateUserById(userId, user);
    return res.status(200).json(ResponseService.response(200, null, updated));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not update this user', error));
  }
};
