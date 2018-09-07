const users = require('../models/database/users');
const watchlist = require('../models/database/watchlist');

async function addWatcher(term, classNum, username) {
  try {
    await watchlist.addWatcher(term, classNum, username);
		await users.addToWatchlist(username, term, classNum);
    return null;
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function removeWatcher(term, classNum, username) {
  try {
    await watchlist.removeWatcher(term, classNum, username);
		await users.removeFromWatchlist(username, term, classNum);
    return null;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = {
  addWatcher,
  removeWatcher,
};
