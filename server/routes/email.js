const EmailRouter = require('express').Router();
const emails = require('../core/email');
const auth = require('../core/auth');
const watchlist = require('../core/watchlist');

// Verifies user token and set user to verified
EmailRouter.get('/verify/user', async function(req, res) {
  const token = req.query.token;
  const { err, username } = await emails.verifyEmailToken(token);
  if (err) return res.status(400).send(err.message);
  res.status(200).json({ username });
});

// Validates and resets user password
EmailRouter.post('/reset/password', async function(req, res) {
  const { token } = req.query;
  const { password } = req.body;
  
  const { err, user } = await auth.resetPassword(token, password);
  if (err) { return res.status(400).send(err); }

  res.status(200).json();
  const { email, username } = user;
  await emails.sendResetPasswordSuccess(email, username);
});

// Verifies unwatch token and removes user from class
EmailRouter.get('/verify/unwatch', async function(req, res) {
  const token = req.query.token;
  const { err, info } = emails.verifyUnwatchToken(token);
  if (err) return res.status(400).send(err.message);
  await watchlist.removeWatcher(info.term, info.classNum, info.username);
  res.status(200).json(info);
});

// Sends verification email
EmailRouter.get('/user/:username/:email', async function(req, res) {
  const username = req.params.username;
  const userEmail = req.params.email;
  const result = await emails.sendVerificationEmail(userEmail, username);
  res.json(result);
});

// Send an email (testing purposes)
EmailRouter.post('/send/:to', async function(req, res) {
  const { to } = req.params;
  const { subject, html } = req.body;
  const result = await emails.sendMail(to, subject, html);
  res.send(result);
});

// Create an email object in table
EmailRouter.post('/create', async function(req, res) {
  let { username, email } = req.body;
  if (!username || !email) return res.status(400).send('Missing fields');

  const err = await emails.createEmail(username, email);
  if (err) return res.status(400).send(err);
  res.send('Email created');
});

// Delete email
EmailRouter.get('/delete/:email', async function(req, res) {
  const email = req.params.email;
  await emails.deleteEmail(email);
  res.send(`${email} deleted`);
});

module.exports = EmailRouter;
