const argon2 = require('argon2');

const {
  ResponseService,
  UserService,
  VerifyService,
  OnlineService,
} = require('../services');

const redis = require('../config/redis');

exports.getMe = async (req, res) => {
  if (req.user) {
    const data = await redis.getAsync(`users:${req.user._id}`);
    if (data) {
      return res
        .status(403)
        .json(
          ResponseService.error(
            403,
            'This account is currently logging in.',
            null,
          ),
        );
    }
  }

  return res.status(200).json(ResponseService.response(200, null, req.user));
};

exports.changePassword = async (req, res) => {
  const { password, newPassword, newPasswordConfirm } = req.body;
  const { user } = req;
  const isPasswordMatch = await argon2.verify(user.password, password);

  if (!isPasswordMatch) {
    res
      .status(400)
      .json(ResponseService.error(400, 'Old password does not match', null));
  }

  if (newPassword !== newPasswordConfirm) {
    res
      .status(400)
      .json(ResponseService.error(400, 'New passwords do not match', null));
  }

  const newPasswordHashed = await argon2.hash(newPassword);

  UserService.updateField({
    query: {
      id: user._id,
    },
    update: { password: newPasswordHashed },
  });

  return res
    .status(200)
    .json(ResponseService.response(200, 'Change password successfully', null));
};

exports.putUpdateProfile = async (req, res) => {
  const { _id } = req.user;
  const update = req.body;
  try {
    const result = await UserService.updateField(_id, update);
    return res
      .status(200)
      .json(ResponseService.response(200, 'Update profile success', result));
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Update profile success', err));
  }
};

exports.getOnline = async (req, res) => {
  try {
    const userOnline = await OnlineService.getUsersOnline();
    console.log(userOnline);
    return res.status(200).json(
      ResponseService.response(
        200,
        'Online List',
        userOnline,
        // eslint-disable-next-line global-require
      ),
    );
  } catch (err) {
    return res.status(200).json(
      ResponseService.response(
        200,
        'Online List',
        [],
        // eslint-disable-next-line global-require
      ),
    );
  }
};

exports.getProfile = async (req, res) => {
  const { id } = req.query;

  try {
    const data = await UserService.getUserInfo(id);

    return res.status(200).json(
      ResponseService.response(
        200,
        'Get profile successfully.',
        data,
        // eslint-disable-next-line global-require
      ),
    );
  } catch (err) {
    return res.status(404).json(
      ResponseService.error(
        400,
        'Cannot get user profile',

        // eslint-disable-next-line global-require
      ),
    );
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const data = await UserService.getLeaderboard();

    return res.status(200).json(
      ResponseService.response(
        200,
        'Get leaderboards successfully.',
        data,
        // eslint-disable-next-line global-require
      ),
    );
  } catch (err) {
    return res.status(404).json(
      ResponseService.error(
        400,
        'Cannot get leaderboards',

        // eslint-disable-next-line global-require
      ),
    );
  }
};

exports.activeAccount = async (req, res) => {
  const { token, email } = req.body;

  const tokenIns = await VerifyService.findOne({
    token,
    email,
  });

  if (!tokenIns) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Invalid Token.', false));
  }

  await VerifyService.deleteOne({
    token,
    email,
  });

  try {
    await UserService.updateFieldByCustomQuery({ email }, { active: true });
    return res
      .status(200)
      .json(ResponseService.error(200, 'Active account successfully.', true));
  } catch (err) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Active account failed.', true));
  }
};
