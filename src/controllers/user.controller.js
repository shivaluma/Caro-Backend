const argon2 = require('argon2');
const { ResponseService, UserService } = require('../services');
const onlinelist = require('../services/OnlineService');
const redis = require('../config/redis');

exports.getMe = async (req, res) => {
  if (req.user) {
    const data = await redis.getAsync(`users:${req.user.id}`);
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
  const list = req.user
    ? [...onlinelist].filter((email) => email !== req.user.email)
    : [...onlinelist];
  return res.status(200).json(
    ResponseService.response(
      200,
      'Online List',
      list,
      // eslint-disable-next-line global-require
    ),
  );
};
