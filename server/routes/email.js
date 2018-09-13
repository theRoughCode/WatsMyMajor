const EmailRouter = require('express').Router();
const email = require('../models/email');
const watchlist = require('../models/watchlist');
const emailDB = require('../models/database/emails');
const usersDB = require('../models/database/users');

// Verifies user token and set user to verified
EmailRouter.get('/verify/user', async function(req, res) {
  const token = req.query.token;
  const { err, username } = email.verifyEmailToken(token);
  if (err) return res.status(400).send(err.message);
  await usersDB.setVerified(username, true);  // Set user as verified
  res.status(200).json({ username });
});

// Verifies unwatch token and removes user from class
EmailRouter.get('/verify/unwatch', async function(req, res) {
  const token = req.query.token;
  const { err, info } = email.verifyUnwatchToken(token);
  if (err) return res.status(400).send(err.message);
  await watchlist.removeWatcher(info.term, info.classNum, info.username);
  res.status(200).json(info);
});

// Sends verification email
EmailRouter.get('/user/:username/:email', async function(req, res) {
  const username = req.params.username;
  const userEmail = req.params.email;
  const result = await email.sendVerificationEmail(userEmail, username);
  res.json(result);
});

// Send an email (testing purposes)
EmailRouter.post('/send/:to', async function(req, res) {
  const { to } = req.params;
  const { subject, html } = req.body;
  const result = await email.sendMail(to, subject, html);
  res.send(result);
});

// Send an unwatch email (testing purposes)
EmailRouter.get('/send/unwatch', async function(req, res) {
  await email.sendClassUpdateEmail(1189, 5694, 'MATH', '137', 1, 'testtest');
  res.send('success');
});

// Create an email object in table
EmailRouter.post('/create', async function(req, res) {
  let { username, email } = req.body;
  if (!username || !email) return res.status(400).send('Missing fields');
  username = username.toLowerCase();
  email = email.toLowerCase();

  /* eslint-disable no-useless-escape */
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) return res.status(400).send('Invalid email');

  const emailExists = await emailDB.emailExists(email);
  if (emailExists) return res.status(400).send('Email already exists');

  await emailDB.setEmail(username, email);
  res.send('Email created');
});

module.exports = EmailRouter;
