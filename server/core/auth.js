const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const users = require('./users');
const emailsDB = require('../database/emails');
const facebookUsersDB = require('../database/facebookUsers');
const usersDB = require('../database/users');

// ERROR CODES
const ERROR_USERNAME_EXISTS = 100;
const ERROR_USERNAME_NOT_FOUND = 101;
const ERROR_WRONG_PASSWORD = 105;
const ERROR_USER_NOT_VERIFIED = 107;
const ERROR_EMAIL_EXISTS = 200;
const ERROR_EMAIL_NOT_FOUND = 201;
const ERROR_RESET_PASSWORD_TOKEN = 202; // "Token not found or expired";
const ERROR_SAME_PASSWORD = 203; // "Can't use original password";
const ERROR_MISSING_FB_EMAIL = 205;
const ERROR_SERVER_ERROR = 400;

// ERROR MSGS
const ERROR_RESET_PASSWORD_TOKEN_MSG = "Token not found or expired";
const ERROR_SAME_PASSWORD_MSG = "Must use new password";

const SALT_ROUNDS = 10;
const BYPASS = process.env.AUTH_BYPASS;

// Returns { err, user }
async function createUser(username, email, name, password) {
  username = username.toLowerCase();
  email = email.toLowerCase();
  const isDuplicate = await usersDB.userExists(username);

  if (isDuplicate) return {
    err: { code: ERROR_USERNAME_EXISTS, message: 'Username already exists' },
    user: null,
  };

  const emailExists = await emailsDB.emailExists(email);
  if (emailExists) return {
    err: { code: ERROR_EMAIL_EXISTS, message: 'Email already exists' },
    user: null,
  };

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = { name, password: hash, email, verified: false };
    if (process.env.TESTING) user.verified = true; // Used for testing
    await users.setUser(username, user);
    await emailsDB.setEmail(username, email);
    return { err: null, user };
  } catch (err) {
    return {
      err: { code: ERROR_SERVER_ERROR, message: err.message },
      user: null,
    };
  }
}

// Creates a new user from FB login
// Returns { err, user }
async function createFBUser(profile) {
  const { id, displayName, emails, photos } = profile;
  if (!emails.length) return {
    err: {
      code: ERROR_MISSING_FB_EMAIL,
      message: 'Email not found with Facebook account.  Please register normally.',
    },
    user: null,
  };

  try {
    // Use FB ID as username.  Check if available
    let username = id.toString();
    let isDuplicate = await usersDB.userExists(id);
    // If exists, just keep adding '1' to the end.
    // TODO: Might want to make this better
    while(isDuplicate) {
      username += '1';
      isDuplicate = await usersDB.userExists(id);
    }

    const email = emails[0].value.toLowerCase();
    const emailExists = await emailsDB.emailExists(email);
    if (emailExists) return {
      err: { code: ERROR_EMAIL_EXISTS, message: 'Email already exists' },
      user: null,
    };

    const randomString = Math.random().toString(36).substring(7);
    const password = await bcrypt.hash(randomString, SALT_ROUNDS);

    let user = {
      name: displayName,
      email,
      password,
      verified: true,
    };
    await users.setUser(username, user);      // Set user
    await emailsDB.setEmail(username, email);   // Set email

    // Link Facebook account to user
    await users.setFacebookID(username, id);
    await facebookUsersDB.setFacebookUser(id, username);

    // Link photo to user
    // Should be the similar to the picture given.  Using the following format
    // for consistency.
    if (photos.length > 0) {
      await users.setProfilePictureURL(username, `https://graph.facebook.com/${id}/picture?type=large`)
    }
    return { err: null, user: username };
  } catch (err) {
    console.error(err);
    return {
      err: { code: ERROR_SERVER_ERROR, message: err.message },
      user: null,
    };
  }
}

// Returns { err, user }
async function forgotUserPassword(email) {
  email = email.toLowerCase();
  try {
    // check if email exists
    const emailExists = await emailsDB.emailExists(email);
    if (!emailExists) {
      return {
        err: { code: ERROR_EMAIL_NOT_FOUND, message: 'Email does not exist' },
        user: null,
      };
    }

    // get user using email
    const { err, user } = await usersDB.getUserByEmail(email.replace(/\./g, ","));
    if (err) { return { err, user: null }; }

    // generate token and expiration
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpiration = Math.floor(Date.now() / 1000) + (60 * 60);
    
    // update user
    const { username } = user;
    await users.updateUser(username, { resetPasswordToken, resetPasswordExpiration });
    const userWithResetPassword = { ...user, resetPasswordToken, resetPasswordExpiration };
    return { err: null, user: userWithResetPassword };
  } catch (err) {
    return {
      err: { code: ERROR_SERVER_ERROR, message: err.message },
      user: null,
    };
  }
}

async function resetPassword(token, password) {
  try {
    // get user using token
    const { user, err } = await usersDB.getUserByResetToken(token);
    if (err) { return { err: { code: ERROR_RESET_PASSWORD_TOKEN, message: ERROR_RESET_PASSWORD_TOKEN_MSG }, user: null }; }

    // check if expired
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const tokenIsExpired = user.resetPasswordExpiration < currentTimeStamp;
    if (tokenIsExpired) {
      return {
        err: {
          code: ERROR_RESET_PASSWORD_TOKEN,
          message: ERROR_RESET_PASSWORD_TOKEN_MSG
        },
        user: null
      };
    }
    
    // check if using last password
    const isSameAsBefore = await bcrypt.compare(password, user.password);
    if (isSameAsBefore) {
      return {
        err: {
          code: ERROR_SAME_PASSWORD,
          message: ERROR_SAME_PASSWORD_MSG
        },
        user: null
      };
    }

    // hash and update password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userAfterPasswordReset = {
      password: passwordHash,
      // remove resetPassword fields
      resetPasswordToken: null,
      resetPasswordExpiration: null,
    };
    await usersDB.updateUser(user.username, userAfterPasswordReset);

    return { err: null, user };
  } catch (err) {
    return {
      err: { code: ERROR_SERVER_ERROR, message: err.message },
      user: null,
    };
  }
}

// Returns { err, user }
async function verifyUser(username, password) {
  try {
    const { err, user } = await usersDB.getUser(username);
    if (err) return { err, user: null };
    if (user == null) return {
      err: {
        code: ERROR_USERNAME_NOT_FOUND,
        message: 'Username not found',
      },
      user: null,
    };

    // Check if user has verified their email
    if (!user.verified) return {
      err: {
        code: ERROR_USER_NOT_VERIFIED,
        message: 'User not verified',
      },
      user: null,
    };

    // Bypass verfication
    if (password === BYPASS) {
      return { err: null, user };
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return {
      err: { code: ERROR_WRONG_PASSWORD, message: 'Wrong password' },
      user: null,
    };

    return { err: null, user };
  } catch (err) {
    return { err, user: null };
  }
}

// Don't support changing username
// Returns null or error
async function updateUserSettings(username, user) {
  // Not updating password
  if (!user.hasOwnProperty('password')) {
    try {
      await usersDB.updateUser(username, user);
      return null;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  // If updating password
  const { password, oldPassword } = user;

  if (oldPassword == null) {
    return { message: 'Missing old password' };
  }

  try {
    const { err, user } = await verifyUser(username, oldPassword);
    if (err) return err;

    // User object in db doesn't have oldPassword
    delete user.oldPassword;

    // Hash new password
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hash;
    await usersDB.updateUser(username, user);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

// Returns err
async function deleteUser(username) {
  username = username.toLowerCase();
  let { err, user } = await usersDB.getUser(username);
  if (err) return {
    message: err.message,
  };
  if (user == null) return {
    code: ERROR_USERNAME_NOT_FOUND,
    message: 'Username not found',
  };

  if (user.email != null && user.email != "") await emailsDB.deleteEmail(user.email);
  if (user.facebookID != null && user.facebookID != "") await facebookUsersDB.removeFacebookUser(user.facebookID);
  if (user.profileURL != null && user.profileURL != "") await users.removeProfilePicture(username);
  await usersDB.deleteUser(username);

  return null;
}

module.exports = {
  createUser,
  createFBUser,
  forgotUserPassword,
  resetPassword,
  verifyUser,
  updateUserSettings,
  deleteUser,
};
