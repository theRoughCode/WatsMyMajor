const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const users = require('../core/users');
const emailsDB = require('../database/emails');
const usersDB = require('../database/users');

require('dotenv').config();
const JWT_SECRET = process.env.SERVER_SECRET;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASS,
  },
});

// Returns err
async function createEmail(username, email) {
  username = username.toLowerCase();
  email = email.toLowerCase();

  /* eslint-disable no-useless-escape */
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) return 'Invalid email';

  // Check if email already exists
  const emailExists = await emailsDB.emailExists(email);
  if (emailExists) return 'Email already exists';

  await emailsDB.setEmail(username, email);
  return null;
}

function deleteEmail(email) {
  return emailsDB.deleteEmail(email);
}

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: 'WatsMyMajor <hello@watsmymajor.com>',
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
}

async function sendVerificationEmail(email, username) {
  const token = jwt.sign({ username }, JWT_SECRET);
  const subject = 'Verify Your Email!';
  const url = `https://www.watsmymajor.com/verify-email?token=${token}`;
  const html = `
    <style>
      #button {
        display: inline-block;
        width: 200px;
        background-color: #414EF9;
        border-radius: 3px;
        color: white;
        font-size: 15px;
        line-height: 45px;
        text-align: center;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        mso-hide: all;
      }
    </style>
    <h1>Verify your email address</h1>
    <p>
      Thanks for signing up for WatsMyMajor! We're excited to have you as an early user.
      Verify your email and start planning out your university career! 🎉
    </p>
    <a href="${url}" id="button">Verify Email</a>
    <p>
      If you’re having trouble clicking the button, copy and paste the URL below into your web browser.
    </p>
    <a href="${url}">${url}</a>
  `;

  return await sendMail(email, subject, html);
}

// Verify email token to verify user's email
// Returns { err, username }
async function verifyEmailToken(token) {
  try {
    const { username } = jwt.verify(token, JWT_SECRET);
    // Set user as verified
    await users.setVerified(username, true);
    return { err: null, username };
  } catch (err) {
    console.error(err);
    return { err, username: null };
  }
}

// Send update email to user about a class opening
async function sendClassUpdateEmail(term, classNum, subject, catalogNumber, numSeats, username) {
  const { user, err } = await usersDB.getUser(username);
  if (err) {
    console.error(err);
    return err;
  }

  const  { name, email } = user;
  const token = jwt.sign({ username, term, classNum, subject, catalogNumber }, JWT_SECRET);
  const url = `https://www.watsmymajor.com/unwatch-class?token=${token}`;

  const numSeatsText = (numSeats === 1)
    ? 'There is 1 seat left.  Go get it!!'
    : `There are ${numSeats} seats left.`;

  const html = `
    <style>
      #button {
        display: inline-block;
        width: 200px;
        background-color: #414EF9;
        border-radius: 3px;
        color: white;
        font-size: 15px;
        line-height: 45px;
        text-align: center;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        mso-hide: all;
      }
    </style>
    <h2>Hey ${name}, there has been an opening for class ${classNum}!</h2>
    <h3>${numSeatsText}</h3>
    <p>
      Click <a href="https://quest.pecs.uwaterloo.ca/psc/MS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SSR_SSENRL_SWAP.GBL?Page=SSR_SSENRL_SWAP&Action=A">here</a> to navigate to your shopping cart.
    </p>
    <a href="${url}" id="button">Unwatch class</a>
    <p>
      If you’re having trouble clicking the button, copy and paste the URL below into your web browser.
    </p>
    <a href="${url}">${url}</a>
  `;

  return await sendMail(email, `Open spot in ${subject} ${catalogNumber}!`, html);
}

// Token used to unsubscribe user from class
function verifyUnwatchToken(token) {
  try {
    const { username, term, classNum, subject, catalogNumber } = jwt.verify(token, JWT_SECRET);
    const info = { username, term, classNum, subject, catalogNumber };
    return { err: null, info };
  } catch (err) {
    console.error(err);
    return { err, info: null };
  }
}


module.exports = {
  createEmail,
  deleteEmail,
  sendMail,
  sendVerificationEmail,
  verifyEmailToken,
  sendClassUpdateEmail,
  verifyUnwatchToken,
};
