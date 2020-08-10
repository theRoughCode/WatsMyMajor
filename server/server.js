const express = require('express');
const path = require('path');
const Sentry = require('@sentry/node');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./router');
// This starts our cron jobs
// eslint-disable-next-line no-unused-vars
const scheduler = require('./core/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow reading body of requests
// Images are 5MB max
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      // Force HTTPS
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else if (req.get('Host') === 'watsmymajorbeta.herokuapp.com') {
      // Redirect if using heroku domain
      const url = (req.originalUrl === '/') ? '' : req.originalUrl;
      res.redirect(301, 'https://www.watsmymajor.com' + url);
    } else next();
  });
}

// Allow use of cookies
app.use(cookieParser());

// Initialize passport authentication
require('./core/passport');
app.use(passport.initialize());

// Priority serve any static and public files.
app.use('/static', express.static(path.join(__dirname, '../react-ui/build/static')));
app.use('/public', express.static(path.join(__dirname, '../react-ui/public')));

// Configure Sentry for error logging
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Connect all our routes to our application
app.use('/', router);

app.listen(PORT, function () {
  /* eslint-disable no-console */
  console.log(`Listening on port ${PORT}`);
});
