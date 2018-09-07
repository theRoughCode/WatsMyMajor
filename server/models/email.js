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
  const url = `https://watsmymajorbeta.herokuapp.com/verify-email?token=${token}`;
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

// Send update email to user about a class opening
async function sendClassUpdateEmail(term, classNum, subject, catalogNumber, numSeats, username) {
  const { user, err } = await users.getUser(username);
  if (err) {
    console.log(err);
    return err;
  }

  const  { name, email } = user;

  const html = `
    <h2>Hey ${name}, there has been an opening for class ${classNum}!</h2>
    <h3>There are ${numSeats} seats left.</h3>
    <p>
      Click <a href="https://quest.pecs.uwaterloo.ca/psc/MS/ACADEMIC/SA/c/SA_LEARNER_SERVICES.SSR_SSENRL_SWAP.GBL?Page=SSR_SSENRL_SWAP&Action=A">here</a> to navigate to your shopping cart.
    </p>
  `;

  console.log(`Sending class update email to ${username}`);

  return await sendMail(email, `Open spot in ${subject} ${catalogNumber}!`, html);
}


module.exports = {
  sendMail,
  sendVerificationEmail,
  verifyEmailToken,
  sendClassUpdateEmail,
};
