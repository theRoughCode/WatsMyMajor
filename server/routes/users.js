const UsersRouter = require('express').Router();
const { setCourseListPrereqs, setCoursesPrereqs } = require('../models/utils');
const users = require('../models/database/users');

// Get user
UsersRouter.get('/:username', function(req, res) {
	const username = req.params.username;

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
	  password: req.body.password || '',
	  cart: req.body.cart || [],
	  schedule: req.body.schedule || [],
	  courseList: req.body.courseList || []
	};

  users.setUser(username, user, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`User ${username} updated successfully.`);
  });
});

// Set cart
// Body: { cart }
UsersRouter.post('/set/cart/:username', function(req, res) {
  const username = req.params.username;

	setCoursesPrereqs(req.body.cart, cart => {
		users.setCart(username, cart, err => {
	    if (err) res.status(400).send(err);
	    else res.json(cart);
	  });
	});
});

UsersRouter.post('/reorder/cart/:username', function(req, res) {
  const username = req.params.username;

	users.setCart(username, req.body.cart, err => {
		if (err) res.status(400).send(err);
		else res.status(200).send(`Cart for User ${username} updated successfully.`);
	});
});

// Set schedule
// Body: { schedule }
UsersRouter.post('/set/schedule/:username', function(req, res) {
  const username = req.params.username;

  users.setSchedule(username, req.body.schedule, err => {
    if (err) res.status(400).send(err);
    else res.status(200).send(`Schedule for User ${username} updated successfully.`);
  });
});

// Set courseList
// Body: { courseList }
UsersRouter.post('/set/courselist/:username', function(req, res) {
  const username = req.params.username;

	setCourseListPrereqs(req.body.courseList, courseList => {
		users.setCourseList(username, courseList, err => {
	    if (err) res.status(400).send(err);
	    else res.json(courseList);
	  });
	});
});

UsersRouter.post('/reorder/courselist/:username', function(req, res) {
  const username = req.params.username;

	users.setCourseList(username, req.body.courseList, err => {
		if (err) res.status(400).send(err);
		else res.status(200).send(`Course list for User ${username} updated successfully.`);
	});
});

module.exports = UsersRouter;
