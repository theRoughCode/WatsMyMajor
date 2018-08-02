const router = require('express').Router();
const passport = require('passport');
const path = require('path');

// Enable env vars
require('dotenv').config();

const SERVER_SECRET = process.env.SERVER_SECRET;

router.get('/', function(req, res){
	res.send('By Raphael Koh');
});

// Pre-check to ensure that API secret key is set.
router.use(function(req, res, next) {
	if (req.headers['x-secret'] === SERVER_SECRET) next();
	else res.sendStatus(401);
});

router.use('/auth', require('./auth'));
router.use('/courses', require('./courses'));
router.use('/majors', require('./majors'));
router.use('/parse', require('./parse'));
router.use('/prof', require('./prof'));
router.use('/reqs', require('./reqs'));
router.use('/stats', require('./stats'));
router.use('/tree', require('./tree'));
router.use('/update', require('./update'));
router.use('/users', passport.authenticate('jwt', { session: false }), require('./users'));
router.use('/wat', require('./wat'));

module.exports = router;
