const users = require('../database/users');
const watchlist = require('../database/watchlist');

async function addWatcher(term, classNum, username) {
  username = username.toLowerCase();
  try {
    await watchlist.addWatcher(term, classNum, username);
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
    await watchlist.removeWatcher(term, classNum, username);
    await users.removeFromWatchlist(username, term, classNum);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

module.exports = {
  addWatcher,
  removeWatcher,
};
