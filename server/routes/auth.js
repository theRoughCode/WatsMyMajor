const AuthRouter = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const email = require('../models/email');
const users = require('../models/database/users');

const JWT_SECRET = process.env.SERVER_SECRET;

// Sign JWT token and populate payload with username
const getToken = (username) => {
	return jwt.sign({ username }, JWT_SECRET);
}

// Register user
AuthRouter.post('/register', async function(req, res) {
	const username = req.body.username.toLowerCase();
	const name = req.body.name;
	const userEmail = req.body.email;
	const password = req.body.password;

	try {
		const { err, user } = await users.createUser(username, userEmail, name, password);
		if (err) {
			console.log(err);
			return res.status(400).json(err);
		}
		await email.sendVerificationEmail(userEmail, username);
		res.cookie('watsmymajor_jwt', getToken(username)).json(user);
	} catch (err) {
		console.log(err);
		return res.status(400).send(err);
	}
});

// Login user
AuthRouter.post('/login', function(req, res) {
	const username = req.body.username.toLowerCase();
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
	passport.authenticate('facebook-token', async function(err, username, info) {
		if (err) {
			console.log(err);
			return res.status(400).send(err);
		}
		if (!username) return res.status(400).send('Facebook User not found.');

		try {
			// Get user from database
			const { user, err } = await users.getUser(username);
			if (err) {
				console.log(err);
				res.status(400).send(err);
			} else if (!user) {
				res.status(400).send('User not found.');
			} else {
				res.cookie('watsmymajor_jwt', getToken(username)).json({ username, user });
			}
		} catch(err) {
			console.log(err);
			res.status(400).send(err);
		}
	})(req, res);
});

module.exports = AuthRouter;
