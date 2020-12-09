const argon2 = require('argon2');
const { ResponseService, UserService } = require('../services');

exports.getMe = async (req, res) => {
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
    console.log(err);
    return res
      .status(500)
      .json(ResponseService.error(500, 'Update profile success', err));
  }
};
