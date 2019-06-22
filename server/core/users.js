const imagesDB = require('../database/images');
const usersDB = require('../database/users');
const {
  fillCourseListMetadata,
  fillCartMetadata,
  stripCourseListMetadata,
  stripCartMetadata,
} = require('../core/utils');

async function getUser(username) {
  const { user, err } = await usersDB.getUser(username);
  if (err) return { user: null, err };

  user.username = username;
  user.cart = await fillCartMetadata(user.cart);
  user.courseList = await fillCourseListMetadata(user.courseList);
  return { user, err: null };
}

function setUser(username, user) {
  return usersDB.setUser(username, user);
}

function getNumUsers() {
  return usersDB.getNumUsers();
}

function getUserSchedule(username) {
  return usersDB.getUserSchedule(username);
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
    const strippedCart = stripCartMetadata(cart);
    await usersDB.setField(username, 'cart', strippedCart);
    cart = await fillCartMetadata(cart);
    return { cart, err: null };
  } catch (err) {
    return { cart: null, err };
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

async function setSchedulePrivacy(username, isPublic) {
  // in case of malformed input
  isPublic = (isPublic === 'true');
  try {
    await usersDB.setField(username, 'isSchedulePublic', isPublic);
    return null;
  } catch (err) {
    return err;
  }
}

async function setCourseList(username, courseList) {
  try {
    const strippedCourseList = stripCourseListMetadata(courseList);
    await usersDB.setField(username, 'courseList', strippedCourseList);
    courseList = await fillCourseListMetadata(courseList);
    return { courseList, err: null };
  } catch (err) {
    return { courseList: null, err };
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

async function setProfilePicture(username, image) {
  try {
    let { err, publicUrl } = await imagesDB.setProfilePicture(username, image);
    if (err) return err;

    await usersDB.setField(username, 'profileURL', publicUrl);
    return null;
  } catch (err) {
    return err;
  }
}

async function setProfilePictureURL(username, url) {
  try {
    await usersDB.setField(username, 'profileURL', url);
    return null;
  } catch (err) {
    return err;
  }
}

async function removeProfilePicture(username) {
  let { err, user } = await usersDB.getUser(username);
  if (err) return err;

  if (user.profileURL != null && user.profileURL.startsWith('https://storage.googleapis.com/')) {
    const start = user.profileURL.indexOf('profile-pictures/');
    const end = user.profileURL.indexOf('?alt=media', start);
    if (start < 0 || end < 0) return {
      message: 'Invalid profileURL',
    };
    const fileName = user.profileURL.slice(start, end);
    err = await imagesDB.removeProfilePicture(fileName);
    if (err) return err;

    await setProfilePictureURL(username, '');
    if (err) return err;
    return null;
  }
}

module.exports = {
  getUser,
  setUser,
  getNumUsers,
  getUserSchedule,
  getUnverifiedUsers,
  updateUser,
  setVerified,
  setCart,
  setSchedule,
  setSchedulePrivacy,
  setCourseList,
  addToWatchlist,
  removeFromWatchlist,
  setFacebookID,
  setProfilePicture,
  setProfilePictureURL,
  removeProfilePicture,
};
