const UsersRouter = require('express').Router();
const { setCourseListPrereqs, setCoursesPrereqs } = require('../models/utils');
const users = require('../models/database/users');
const images = require('../models/database/images');
const facebookUsers = require('../models/database/facebookUsers');

// Get user
UsersRouter.get('/:username', function(req, res) {
	const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	users.getUser(username, (err, user) => {
		if (err) res.status(400).send(err);
		else res.json(user);
	});
});

// Link facebook id to user
UsersRouter.post('/link/facebook/:username', function(req, res) {
	const username = req.params.username;
	const facebookID = req.body.facebookID;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	if (!facebookID) {
		res.status(400).send('Missing facebook ID.');
		return;
	}

	// Add facebook ID to user object
	users.setFacebookID(username, facebookID, err => {
		if (err) {
			res.status(400).send(err);
			return;
		}

		// Add facebook ID to facebookUser refererence
		facebookUsers.setFacebookUser(facebookID, username, err => {
			if (err) res.status(400).send(err);
			else res.status(200).send(`User ${username}'s facebook account has been linked.`);
		});
	});
});

// Update user settings
UsersRouter.post('/edit/settings/:username', function(req, res) {
	const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	// Convert req.body to object
	const user = Object.assign({}, req.body);

	users.updateUserSettings(username, user, err => {
		if (err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			users.getUser(username, (err, user) => {
				if (err) {
					console.log(err);
					res.status(400).send(err);
				} else res.status(200).json(user);
			});
		}
	});
});

// Set user
// Body: { user }
UsersRouter.post('/set/user/:username', function(req, res) {
  const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	const user = {
		name: req.body.name || '',
	  password: req.body.password || '',
	  cart: req.body.cart || [],
	  schedule: req.body.schedule || [],
	  courseList: req.body.courseList || []
	};

  users.setUser(username, user, err => {
    if (err) res.status(400).send(err);
    else res.json(user);
  });
});

// Update user
// Body: { user }
UsersRouter.post('/edit/:username', function(req, res) {
  const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

  users.updateUser(username, req.body, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`User ${username} updated successfully.`);
  });
});

// Set cart
// Body: { cart }
UsersRouter.post('/set/cart/:username', function(req, res) {
  const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	setCoursesPrereqs(req.body.cart, cart => {
		users.setCart(username, cart, err => {
	    if (err) res.status(400).send(err);
	    else res.json(cart);
	  });
	});
});

UsersRouter.post('/reorder/cart/:username', function(req, res) {
  const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	users.setCart(username, req.body.cart, err => {
		if (err) res.status(400).send(err);
		else res.status(200).send(`Cart for User ${username} updated successfully.`);
	});
});

// Set schedule
// Body: { schedule }
UsersRouter.post('/set/schedule/:username', function(req, res) {
  const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

  users.setSchedule(username, req.body.schedule, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`Schedule for User ${username} updated successfully.`);
  });
});

// Set courseList
// Body: { courseList }
UsersRouter.post('/set/courselist/:username', function(req, res) {
  const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	setCourseListPrereqs(req.body.courseList, courseList => {
		users.setCourseList(username, courseList, err => {
	    if (err) res.status(400).send(err);
	    else res.json(courseList);
	  });
	});
});

UsersRouter.post('/reorder/courselist/:username', function(req, res) {
  const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	users.setCourseList(username, req.body.courseList, err => {
		if (err) res.status(400).send(err);
		else res.status(200).send(`Course list for User ${username} updated successfully.`);
	});
});

const easterURL = images.getEasterURL();
UsersRouter.post('/upload/profile/:username', function(req, res) {
	const username = req.params.username;
	if (req.user !== username) {
		res.sendStatus(401);
		return;
	}

	const { base64Str, contentType, easterRaph } = req.body;

	// User found easter egg
	if (easterRaph) {
		users.updateUser(username, { profileURL: easterURL }, err => {
			if (err) return res.status(400).send(err);

			// Return user object
			users.getUser(username, (err, user) => {
				if (err) return	res.status(400).send(err);
				else res.status(200).json(user);
			});
		});
	} else if (!base64Str || !contentType) {
		res.status(400).send('Missing fields');
	} else {
		// Upload image to storage
		images.setProfilePicture(username, req.body, (err, url) => {
			if (err) return res.status(400).send(err);

			// Update new profile img url in user object
			users.updateUser(username, { profileURL: url }, err => {
				if (err) return res.status(400).send(err);

				// Return user object
				users.getUser(username, (err, user) => {
					if (err) return	res.status(400).send(err);
					else res.status(200).json(user);
				});
			});
		});
	}
});

module.exports = UsersRouter;
