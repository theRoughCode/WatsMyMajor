const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const users = require('./database/users');

require('dotenv').config();
const JWT_SECRET = process.env.SERVER_SECRET;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASS,
  },
});

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
  const url = `http://localhost:3000/verify-email?token=${token}`;
  const html = `
    <style type="text/css" rel="stylesheet" media="all">
      .button {
        display: inline-block;
        width: 200px;
        background-color: #414EF9;
        border-radius: 3px;
        color: #ffffff;
        font-size: 15px;
        line-height: 45px;
        text-align: center;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        mso-hide: all;
      }
      .button--blue {
        background-color: #414EF9;
      }
    </style>
    <h1>Verify your email address</h1>
    <p>
      Thanks for signing up for WatsMyMajor! We're excited to have you as an early user.
      Verify your email and start planning out your university career! 🎉
    </p>
    <a href="${url}" class="button button--blue">Verify Email</a>
    <p>
      If you’re having trouble clicking the button, copy and paste the URL below into your web browser.
    </p>
    <a href="${url}">${url}</a>
  `;

  return await sendMail(email, subject, html);
}

// Verify email token to verify user's email
function verifyEmailToken(token) {
  try {
    const { username } = jwt.verify(token, JWT_SECRET);
    return { err: null, username };
  } catch (err) {
    console.log(err);
    return { err, username: null };
  }
}


module.exports = {
  sendMail,
  sendVerificationEmail,
  verifyEmailToken,
};
