const UsersRouter = require('express').Router();
const users = require('../models/database/users');

// Get user
UsersRouter.get('/:userId', function(req, res) {
	const userId = req.params.userId;

	users.getUser(userId, (err, user) => {
		if (err) res.status(400).send(err);
		else res.json(user);
	});
});

// Set user
// Body: { user }
UsersRouter.post('/set/user/:userId', function(req, res) {
  const userId = req.params.userId;

  users.setUser(userId, req.body.user, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`User ${userId} updated successfully.`)
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
