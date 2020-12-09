require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const got = require('got');
const { ResponseService, UserService } = require('../services');

exports.postSignUp = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Please provide all necessary data.'));
  }

  if (password !== confirmPassword) {
    return res.status(400).json(
      ResponseService.error(400, 'Password and confirmPassword do not match.', {
        fields: ['password', 'confirmPassword'],
      })
    );
  }

  try {
    const hashedPassword = await argon2.hash(password);

    try {
      await UserService.createUser(email, hashedPassword, email);
      return res
        .status(201)
        .json(
          ResponseService.response(201, 'Create account successfully.', null)
        );
    } catch (err) {
      return res
        .status(400)
        .json(
          ResponseService.error(400, 'Email exist.', { fields: ['email'] })
        );
    }
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Server error.', err));
  }
};

exports.postSignIn = async (req, res) => {
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
            null
          )
        );

    const isSamePassword = await argon2.verify(user.password, password);

    if (!isSamePassword) {
      return res
        .status(400)
        .json(ResponseService.error(400, 'Wrong email or password.', null));
    }

    const payload = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: payload,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Server error.', err));
  }
};

exports.postGoogleSignIn = async (req, res) => {
  const { ggAccessToken } = req.body;
  if (!ggAccessToken) {
    return res
      .status(404)
      .json(
        ResponseService.error(404, 'Cannot found the google access token.')
      );
  }
  try {
    const query = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${ggAccessToken}`;
    const response = await got(`${query}`).json();

    const user = await UserService.findOne({
      $or: [{ idGoogle: response.sub }, { email: response.email }],
    });

    if (user) {
      if (user.idGoogle === response.sub) {
        const payload = {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
        };
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
        return res.status(200).json(
          ResponseService.response(200, 'Login Successfully.', {
            accessToken,
            user: payload,
          })
        );
      }

      return res
        .status(400)
        .json(
          ResponseService.error(
            400,
            'There is an account with this email address, if you own the account, please login and then bind to this google account.'
          )
        );
    }

    const newUserResponse = await UserService.createUser(
      response.email,
      'heheuguess',
      response.name,
      response.sub
    );

    const newUser = newUserResponse.ops[0];

    const payload = {
      id: newUser._id,
      email: newUser.email,
      displayName: newUser.displayName,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: payload,
      })
    );

    // create account
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Internal Server Error', err));
  }
};

exports.getValidField = async (req, res) => {
  const { value, field } = req.query;
  if (!value || !field) {
    return res
      .status(400)
      .json(ResponseService.response(400, `field or value is missing.`));
  }
  const user = await UserService.findOne({ [field]: value });
  if (!user) {
    return res.status(200).json(
      ResponseService.response(200, `${field} *${value}* is available.`, {
        isFree: true,
      })
    );
  }

  return res.status(200).json(
    ResponseService.response(200, `${field} *${value}* is not available.`, {
      isFree: false,
    })
  );
};

exports.postFacebookSignin = async (req, res) => {
  const { id, fbAccessToken } = req.body;
  if (!fbAccessToken) {
    return res
      .status(404)
      .json(
        ResponseService.error(404, 'Cannot found the facebook access token.')
      );
  }
  try {
    const query = `https://graph.facebook.com/${id}?fields=birthday,email,picture,name&access_token=${fbAccessToken}`;
    const response = await got(`${query}`).json();
    console.log(response);
    const user = await UserService.findOne({
      $or: [{ 'socials.facebookId': response.id }, { email: response.email }],
    });

    if (user) {
      const payload = {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      };
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
      return res.status(200).json(
        ResponseService.response(200, 'Login Successfully.', {
          accessToken,
          user: payload,
        })
      );
    }

    const newUserResponse = await UserService.createUser(
      response.email,
      'heheuguess',
      response.name,
      null,
      response.id
    );

    const newUser = newUserResponse.ops[0];

    const payload = {
      id: newUser._id,
      email: newUser.email,
      displayName: newUser.displayName,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: payload,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Internal Server Error', err));
  }
};
