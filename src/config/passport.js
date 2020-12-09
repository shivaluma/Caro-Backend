require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { ObjectId } = require('mongodb');
const { ResponseService } = require('../services');
const UserService = require('../services/UserService');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      UserService.findOne(
        { _id: ObjectId(jwt_payload.id) },
        { projection: { password: 0 } }
      )
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(
            null,
            false,
            ResponseService.error(400, 'Invalid Token Provided')
          );
        })
        .catch((err) =>
          done(
            null,
            false,
            ResponseService.error(500, 'Internal Server Error', err)
          )
        );
    })
  );
};
