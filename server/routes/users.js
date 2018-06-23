const UsersRouter = require('express').Router();
const users = require('../models/database/users');

// Get user
UsersRouter.get('/:username', function(req, res) {
	const username = req.params.username;
	console.log(username)

	users.getUser(username, (err, user) => {
		if (err) res.status(400).send(err);
		else res.json(user);
	});
});

// Set user
// Body: { user }
UsersRouter.post('/set/user/:username', function(req, res) {
  const username = req.params.username;
	const user = {
		name: req.body.name || '',
	  pass: req.body.pass || '',
	  cart: req.body.cart || [],
	  schedule: req.body.schedule || [],
	  courseList: req.body.courseList || []
	};

  users.setUser(username, user, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`User ${username} updated successfully.`)
  });
});

// Set cart
// Body: { cart }
UsersRouter.post('/set/cart/:userId', function(req, res) {
  const userId = req.params.userId;

  users.setCart(userId, req.body.cart, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`Cart for User ${userId} updated successfully.`)
  });
});

// Set schedule
// Body: { schedule }
UsersRouter.post('/set/schedule/:userId', function(req, res) {
  const userId = req.params.userId;

  users.setSchedule(userId, req.body.schedule, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`Schedule for User ${userId} updated successfully.`)
  });
});

// Set courseList
// Body: { courseList }
UsersRouter.post('/set/courselist/:userId', function(req, res) {
  const userId = req.params.userId;

  users.setCourseList(userId, req.body.courseList, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`Course list for ${userId} updated successfully.`)
  });
});

module.exports = UsersRouter;
