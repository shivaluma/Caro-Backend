require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const got = require('got');
const { ResponseService, UserService } = require('../../services');

exports.postSignInAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'No email/password was provided.'));
  }

  try {
    const user = await UserService.findOne({ email });
    req.log.info(user);
    if (!user)
      return res
        .status(404)
        .json(
          ResponseService.error(
            404,
            'Cannot find account with this email.',
            null,
          ),
        );

    const isSamePassword = await argon2.verify(user.password, password);

    if (!isSamePassword) {
      return res
        .status(400)
        .json(ResponseService.error(400, 'Wrong email or password.', null));
    }

    if (user.role !== 'Admin') {
      return res
        .status(403)
        .json(ResponseService.error(403, 'Does not have permission.'));
    }

    const payload = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: payload,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Server error.', err));
  }
};
