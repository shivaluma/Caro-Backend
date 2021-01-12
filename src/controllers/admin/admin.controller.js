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

exports.getHistoryByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await AdminService.getHistoryByUserId(userId);
    return res.status(200).json(ResponseService.response(200, null, history));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get this history', error));
  }
};

exports.getChatByMatchId = async (req, res) => {
  const { matchId } = req.params;
  try {
    const match = await AdminService.getMatchById(matchId);
    return res
      .status(200)
      .json(ResponseService.response(200, null, match.chats));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get this chat history', error));
  }
};

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
    const { status } = req.body;
    const updated = AdminService.updateUserById(userId, status);
    return res.status(200).json(ResponseService.response(200, null, updated));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not update this user', error));
  }
};

exports.getHistoryByMatchId = async (req, res) => {
  const { matchId } = req.params;
  try {
    const match = await AdminService.getMatchById(matchId);
    return res.status(200).json(ResponseService.response(200, null, match));
  } catch (error) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Can not get this history', error));
  }
};
