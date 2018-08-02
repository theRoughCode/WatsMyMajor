const AuthRouter = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const users = require('../models/database/users');

const JWT_SECRET = process.env.SERVER_SECRET;

// Register user
AuthRouter.post('/register', function(req, res) {
	const username = req.body.username;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	users.createUser(username, email, name, password, (err, user) => {
		if (err) {
			console.log(err);
			res.status(400).json(err);
		} else {
      // Sign JWT token and populate payload with username and email
			const token = jwt.sign({ username }, JWT_SECRET);
      res.cookie('watsmymajor_jwt', token).json({ username, email, name });
    }
	});
});

// Login user
AuthRouter.post('/login', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	passport.authenticate('login', { session: false }, (err, user, info) => {
		if (err) {
			console.log(err);
			res.status(400).send(err);
		} else if (!user) {
			res.status(400).send('User not found.');
		} else {
			// Sign JWT token and populate payload with username and email
			const token = jwt.sign({ username }, JWT_SECRET);
			res.cookie('watsmymajor_jwt', token).json(user);
		}
	})(req, res);
});

module.exports = AuthRouter;
