const router = require('express').Router();
const passport = require('passport');

// Enable env vars
require('dotenv').config();

const SERVER_SECRET = process.env.SERVER_SECRET;

// Pre-check to ensure that API secret key is set.
router.use(function (req, res, next) {
  if (req.headers['x-secret'] === SERVER_SECRET) next();
  else res.sendStatus(401);
});

router.get('/', (req, res) => res.send('By Raphael Koh'));
router.use('/auth', require('./auth'));
router.use('/courses', require('./courses'));
router.use('/email', require('./email'));
router.use('/majors', require('./majors'));
router.use('/parse', require('./parse'));
router.use('/prof', require('./prof'));
router.use('/ratings/course', require('./courseRatings'));
router.use('/reqs', require('./reqs'));
router.use('/schedule', require('./schedule'));
router.use('/scrape', require('./scrape'));
router.use('/stats', require('./stats'));
router.use('/tree', require('./tree'));
router.use('/update', require('./update'));
router.use('/wat', require('./wat'));
router.use('/watchlist', require('./watchlist'));
router.use('/users', passport.authenticate('jwt', { session: false }), require('./users'));
router.all('*', (req, res) => res.sendStatus(404));

module.exports = router;
