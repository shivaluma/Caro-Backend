require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const got = require('got');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const { ResponseService, UserService, VerifyService } = require('../services');
const redis = require('../config/redis');

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
      }),
    );
  }

  try {
    const hashedPassword = await argon2.hash(password);

    try {
      await UserService.createUser(email, hashedPassword, email);
      return res
        .status(201)
        .json(
          ResponseService.response(201, 'Create account successfully.', null),
        );
    } catch (err) {
      return res
        .status(400)
        .json(
          ResponseService.error(400, 'Email exist.', { fields: ['email'] }),
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
            null,
          ),
        );

    const isSamePassword = await argon2.verify(user.password, password);

    if (!isSamePassword) {
      return res
        .status(400)
        .json(ResponseService.error(400, 'Wrong email or password.', null));
    }

    const data = await redis.getAsync(`users:${user._id}`);

    if (data) {
      return res
        .status(400)
        .json(
          ResponseService.error(
            400,
            'This account is currently logging in.',
            null,
          ),
        );
    }
    const userData = { ...user };
    delete userData.password;
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: userData,
      }),
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
        ResponseService.error(404, 'Cannot found the google access token.'),
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
        const payload = { ...user };
        delete payload.password;
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
        return res.status(200).json(
          ResponseService.response(200, 'Login Successfully.', {
            accessToken,
            user: payload,
          }),
        );
      }

      return res
        .status(400)
        .json(
          ResponseService.error(
            400,
            'There is an account with this email address, if you own the account, please login and then bind to this google account.',
          ),
        );
    }

    const newUserResponse = await UserService.createUser(
      response.email,
      'heheuguess',
      response.name,
      response.sub,
    );

    const newUser = newUserResponse.ops[0];

    const payload = { _id: newUser._id };
    const userData = { ...newUser };
    delete userData.password;

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: userData,
      }),
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
      }),
    );
  }

  return res.status(200).json(
    ResponseService.response(200, `${field} *${value}* is not available.`, {
      isFree: false,
    }),
  );
};

exports.postFacebookSignin = async (req, res) => {
  const { id, fbAccessToken } = req.body;
  if (!fbAccessToken) {
    return res
      .status(404)
      .json(
        ResponseService.error(404, 'Cannot found the facebook access token.'),
      );
  }
  try {
    const query = `https://graph.facebook.com/${id}?fields=birthday,email,picture,name&access_token=${fbAccessToken}`;
    const response = await got(`${query}`).json();

    const user = await UserService.findOne({
      $or: [{ 'socials.facebookId': response.id }, { email: response.email }],
    });

    if (user) {
      const payload = { ...user };
      delete payload.password;
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
      return res.status(200).json(
        ResponseService.response(200, 'Login Successfully.', {
          accessToken,
          user: payload,
        }),
      );
    }

    const newUserResponse = await UserService.createUser(
      response.email,
      'heheuguess',
      response.name,
      null,
      response.id,
    );

    const newUser = newUserResponse.ops[0];

    const userData = { ...newUser };
    delete userData.password;
    const payload = { _id: newUser._id };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).json(
      ResponseService.response(200, 'Login Successfully.', {
        accessToken,
        user: userData,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Internal Server Error', err));
  }
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Please input email!' });

  try {
    const randomhash = randomstring.generate();
    const user = await UserService.findOne({
      email,
    });

    if (!user)
      return res.status(404).json(
        ResponseService.error(
          404,
          'Cannot find account with this email.',

          // eslint-disable-next-line global-require
        ),
      );

    const verify = await VerifyService.createVerify(
      randomhash,
      user._id,
      user.email,
    );

    if (!verify) {
      return res.status(500).json(
        ResponseService.error(
          500,
          'Something went wrong.',

          // eslint-disable-next-line global-require
        ),
      );
    }
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'shivaluma7@gmail.com',
        pass: 'nguhamay',
      },
    });

    const mainOptions = {
      from: 'BrosCaro',
      to: email,
      priority: 'high',
      subject: 'BrosCaro Password Reset Verification',
      text: 'Forgot password',
      html: `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100% !important;">
          <tr><td align="center">
        <table style="; border:1px solid #eaeaea;border-radius:5px;margin:40px 0;" width="600" border="0" cellspacing="0" cellpadding="40">
          <tr><td align="center"><div style="font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;text-align:left;width:465px;">
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100% !important;">
          <tr><td align="center">
          <div><img src="https://assets.vercel.com/email/vercel.png" width="40" height="37" alt="Vercel" /></div>
          <h1 style="color:#000;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:24px;font-weight:normal;margin:30px 0;padding:0;">Reset password from <b>BrosCode</b></h1>
        </td></tr>
        </table>
        
        <p style="color:#000;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;line-height:24px;">Hello <b> ${user.email}</b>,</p>
        <p style="color:#000;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;line-height:24px;">This is the link to reset your password : !</p>

       
        
        <a href="http://localhost:3000/forgot-password?email=${user.email}&token=${randomhash}">http://localhost:3000/forgot-password?email=${user.email}&token=${randomhash}</a>
        
        
       

        If you think you received this email by mistake, feel free to ignore it.
        Thanks,
        BrosTeam.
        <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%;"></hr>
        </div></td></tr>
        </table>
        </td></tr>
        </table>`,
    };
    transporter.sendMail(mainOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Sent:${info.response}`);
      }
    });

    res.status(201).json(
      ResponseService.response(
        201,
        'Request successfully.',
        null,
        // eslint-disable-next-line global-require
      ),
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Some error occurs, please contact the administrator for help.',
    });
  }
};

exports.getCheckToken = async (req, res) => {
  const { token, email } = req.query;
  const tokenIns = await VerifyService.findOne({
    token,
    email,
  });

  if (!tokenIns) {
    return res.status(400).json(
      ResponseService.error(
        400,
        'Invalid Token.',
        // eslint-disable-next-line global-require
      ),
    );
  }

  return res
    .status(200)
    .json(ResponseService.response(200, 'Token Oke.', true));
};

exports.changeNewPassword = async (req, res) => {
  const { token, email, password } = req.body;
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

  const newPasswordHashed = await argon2.hash(password);

  await UserService.updateFieldByCustomQuery(
    {
      email,
    },
    { password: newPasswordHashed },
  );

  return res.status(200).json(
    ResponseService.response(
      200,
      'Change password successfully.',
      // eslint-disable-next-line global-require
    ),
  );
};
