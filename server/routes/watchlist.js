const WatchlistRouter = require('express').Router();
const users = require('../models/database/users');
const watchlist = require('../models/database/watchlist');

// Get watchers for a class
WatchlistRouter.get('/watchers/:term/:classNum', async function(req, res) {
	const { term, classNum } = req.params;

	const { watchers, err } = await watchlist.getWatchers(term, classNum);
	if (err) res.status(400).send(err.message);
	else res.json(watchers);
});

// Add watcher to class
WatchlistRouter.get('/watchers/add/:term/:classNum/:username', async function(req, res) {
  const { term, classNum, username } = req.params;

  try {
    await watchlist.addWatcher(term, classNum, username);
		await users.addToWatchlist(username, term, classNum);
    res.send(`${username} added to class ${classNum}`);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

// Remove watcher from class
WatchlistRouter.get('/watchers/remove/:term/:classNum/:username', async function(req, res) {
  const { term, classNum, username } = req.params;

  try {
    await watchlist.removeWatcher(term, classNum, username);
		await users.removeFromWatchlist(username, term, classNum);
    res.send(`${username} removed from class ${classNum}`);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

// Get enrollment numbers for a class
WatchlistRouter.get('/enrollment/:term/:classNum', async function(req, res) {
	const { term, classNum } = req.params;

	const { enrollment, err } = await watchlist.getEnrollment(term, classNum);
	if (err) res.status(400).send(err.message);
	else res.json(enrollment);
});


module.exports = WatchlistRouter;
