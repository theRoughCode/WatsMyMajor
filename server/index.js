const express = require('express');
const path = require('path');
const Raven = require('raven');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./router');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow reading body of requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow use of cookies
app.use(cookieParser());

// Initialize passport authentication
require('./helpers/passport');
app.use(passport.initialize());

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Configure Raven for logging to Sentry
Raven.config(process.env.SENTRY_DSN).install();

// Connect all our routes to our application
app.use('/', router);

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
