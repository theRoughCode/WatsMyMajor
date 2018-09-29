const usersDB = require('../database/users');

function getUser(username) {
  return usersDB.getUser(username);
}

function setUser(username) {
  return usersDB.setUser(username);
}

function getNumUsers() {
  return usersDB.getNumUsers();
}

function getUnverifiedUsers() {
  return usersDB.getUnverifiedUsers();
}

function updateUser(username, user) {
  // Ensure that passwords aren't being set here (would be plaintext).
  // Should use updateUserSettings for passwords
  if (user.hasOwnProperty('password')) delete user.password;
  return usersDB.updateUser(username, user);
}

async function setVerified(username, isVerified) {
  try {
    await usersDB.setField(username, 'verified', isVerified);
    return null;
  } catch (err) {
    return err;
  }
}

async function setCart(username, cart) {
  try {
    await usersDB.setField(username, 'cart', cart);
    return null;
  } catch (err) {
    return err;
  }
}

async function setSchedule(username, schedule) {
  try {
    await usersDB.setField(username, 'schedule', schedule);
    return null;
  } catch (err) {
    return err;
  }
}

async function setCourseList(username, courseList) {
  try {
    await usersDB.setField(username, 'courseList', courseList);
    return null;
  } catch (err) {
    return err;
  }
}

async function addToWatchlist(username, term, classNum) {
  try {
    await usersDB.setField(username, `watchlist/${term}/${classNum}`, true);
    return null;
  } catch (err) {
    return err;
  }
}

async function removeFromWatchlist(username, term, classNum) {
  try {
    await usersDB.setField(username, `watchlist/${term}/${classNum}`, null);
    return null;
  } catch (err) {
    return err;
  }
}

async function setFacebookID(username, facebookID) {
  try {
    await usersDB.setField(username, 'facebookID', facebookID);
    return null;
  } catch (err) {
    return err;
  }
}

async function setProfilePicture(username, url) {
  try {
    await usersDB.setField(username, 'profileURL', url);
    return null;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getUser,
  setUser,
  getNumUsers,
  getUnverifiedUsers,
  updateUser,
  setVerified,
  setCart,
  setSchedule,
  setCourseList,
  addToWatchlist,
  removeFromWatchlist,
  setFacebookID,
  setProfilePicture,
};
