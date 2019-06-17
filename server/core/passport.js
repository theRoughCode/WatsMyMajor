const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const auth = require('./auth');
const facebookUsers = require('../database/facebookUsers');

const opt = {
  jwtFromRequest: (req) => req.cookies['watsmymajor_jwt'],
  secretOrKey:  process.env.SERVER_SECRET
};

// Used to authenticate logins
passport.use('login', new LocalStrategy(
  async function(username, password, callback) {
    try {
      const { err, user } = await auth.verifyUser(username.toLowerCase(), password);
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
}, async function(accessToken, refreshToken, profile, callback) {
  // Check if facebook user is in database and get corresponding username
  let { err, user } = await facebookUsers.getFacebookUser(profile.id);
  // Create new user if hasn't been created yet
  if (!user) ({ err, user } = await auth.createFBUser(profile));

  callback(err, user);
}));
