const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const users = require('../models/database/users');
const facebookUsers = require('../models/database/facebookUsers');

const opt = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey:  process.env.SERVER_SECRET
};

// Used to authenticate logins
passport.use('login', new LocalStrategy(
  async function(username, password, callback) {
    try {
      const { err, user } = await users.verifyUser(username, password);
      if (err) return callback(err);
      callback(null, user);
    } catch (err) {
      callback(err);
    }
  }
));

// Used to authenticate JWT
passport.use(new JWTStrategy(opt, function(token, callback) {
  if (token.username) callback(null, token.username);
  else callback(true);
}));

// Facebook Authentication
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET
}, function(accessToken, refreshToken, profile, callback) {
  // Check if facebook user is in database and get corresponding username
  facebookUsers.getFacebookUser(profile.id, callback);
}));
