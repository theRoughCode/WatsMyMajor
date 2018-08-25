const EmailRouter = require('express').Router();
const email = require('../models/email');
const usersDB = require('../models/database/users');
const emailDB = require('../models/database/emails');

EmailRouter.get('/verify', async function(req, res) {
  const token = req.query.token;
  const { err, username } = email.verifyEmailToken(token);
  if (err) return res.status(400).send(err.message);
  usersDB.setVerified(username, true);  // Set user as verified
  res.status(200).json({ username });
});

// Setd verifixation email
EmailRouter.get('/user/:username/:email', async function(req, res) {
  const username = req.params.username;
  const userEmail = req.params.email;
  const result = await email.sendVerificationEmail(userEmail, username);
  res.json(result);
});

EmailRouter.post('/send/:to', async function(req, res) {
  const { to } = req.params;
  const { subject, html } = req.body;
  const result = await email.sendMail(to, subject, html);
  res.send(result);
});

EmailRouter.post('/create', async function(req, res) {
  const { username, email } = req.body;
  if (!username || !email) return res.status(400).send('Missing fields');

  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) return res.status(400).send('Invalid email');

  const emailExists = await emailDB.emailExists(email);
  if (emailExists) return res.status(400).send('Email already exists');

  await emailDB.setEmail(username, email);
  res.send('Email created');
});

module.exports = EmailRouter;
