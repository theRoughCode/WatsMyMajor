const WatchlistRouter = require('express').Router();
const watchlist = require('../core/watchlist');

// Get watchers for a class
WatchlistRouter.get('/watchers/:term/:classNum', async function (req, res) {
  const { term, classNum } = req.params;

  const { watchers, err } = await watchlist.getWatchers(term, classNum);
  if (err) res.status(400).send(err.message);
  else res.json(watchers);
});

// Add watcher to class
WatchlistRouter.get('/watchers/add/:term/:classNum/:username', async function (req, res) {
  const { term, classNum, username } = req.params;

  const err = await watchlist.addWatcher(term, classNum, username);
  if (err) res.status(400).send(err.message);
  else res.send(`${username} added to class ${classNum}`);
});

// Remove watcher from class
WatchlistRouter.get('/watchers/remove/:term/:classNum/:username', async function (req, res) {
  const { term, classNum, username } = req.params;

  const err = await watchlist.removeWatcher(term, classNum, username);
  if (err) res.status(400).send(err.message);
  else res.send(`${username} removed from class ${classNum}`);
});

// Get enrollment numbers for a class
WatchlistRouter.get('/enrollment/:term/:classNum', async function (req, res) {
  const { term, classNum } = req.params;

  const { enrollment, err } = await watchlist.getEnrollment(term, classNum);
  if (err) res.status(400).send(err.message);
  else res.json(enrollment);
});

// Get subject and catalog number for a class
WatchlistRouter.get('/info/:term/:classNum', async function (req, res) {
  const { term, classNum } = req.params;

  const { subject, catalogNumber, err } = await watchlist.getSubjectAndCatNum(term, classNum);
  if (err) res.status(400).send(err.message);
  else res.json({ subject, catalogNumber });
});

module.exports = WatchlistRouter;
