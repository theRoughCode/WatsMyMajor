const bcrypt = require('bcryptjs');
const emailsDB = require('../database/emails');
const usersDB = require('../database/users');

// ERROR CODES
const ERROR_USERNAME_EXISTS = 100;
const ERROR_USERNAME_NOT_FOUND = 101;
const ERROR_WRONG_PASSWORD = 105;
const ERROR_USER_NOT_VERIFIED = 107;
const ERROR_EMAIL_EXISTS = 200;
const ERROR_SERVER_ERROR = 400;

const saltRounds = 10;
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
    const hash = await bcrypt.hash(password, saltRounds);
    const user = { name, password: hash, email, verified: false };
    await usersDB.setUser(username, user);
    await emailsDB.setEmail(username, email);
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
    const hash = await bcrypt.hash(password, saltRounds);
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

  await usersDB.deleteUser(username);
  if (user.email != null) await emailsDB.deleteEmail(user.email);
  return null;
}

module.exports = {
  createUser,
  verifyUser,
  updateUserSettings,
  deleteUser,
};
