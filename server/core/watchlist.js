const users = require('./users');
const watchlistDB = require('../database/watchlist');

function getWatchers(term, classNum) {
  return watchlistDB.getWatchers(term, classNum);
}

function getEnrollment(term, classNum) {
  return watchlistDB.getEnrollment(term, classNum);
}

function getSubjectAndCatNum(term, classNum) {
  return watchlistDB.getSubjectAndCatNum(term, classNum);
}

async function addWatcher(term, classNum, username) {
  username = username.toLowerCase();
  try {
    await watchlistDB.addWatcher(term, classNum, username);
    await users.addToWatchlist(username, term, classNum);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function removeWatcher(term, classNum, username) {
  username = username.toLowerCase();
  try {
    await watchlistDB.removeWatcher(term, classNum, username);
    await users.removeFromWatchlist(username, term, classNum);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

module.exports = {
  getWatchers,
  getEnrollment,
  getSubjectAndCatNum,
  addWatcher,
  removeWatcher,
};
