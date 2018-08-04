const AuthRouter = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const users = require('../models/database/users');

const JWT_SECRET = process.env.SERVER_SECRET;

// Sign JWT token and populate payload with username
const getToken = (username) => {
	return jwt.sign({ username }, JWT_SECRET);
}

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
      res.cookie('watsmymajor_jwt', getToken(username)).json({ username, email, name });
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
			res.cookie('watsmymajor_jwt', getToken(username)).json(user);
		}
	})(req, res);
});

// Facebook authentication
AuthRouter.get('/facebook', function(req, res) {
	passport.authenticate('facebook-token', (err, username, info) => {
		if (err) {
			console.log(err);
			res.status(400).send(err);
			return;
		}
		if (!username) {
			res.status(400).send('Facebook User not found.');
			return;
		}

		// Get user from database
		users.getUser(username, (err, user) => {
			if (err) {
				console.log(err);
				res.status(400).send(err);
			} else if (!user) {
				res.status(400).send('User not found.');
			} else {
				res.cookie('watsmymajor_jwt', getToken(username)).json({ username, user });
			}
		});
	})(req, res);
});

module.exports = AuthRouter;
