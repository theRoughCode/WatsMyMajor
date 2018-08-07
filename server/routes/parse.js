const ParseRouter = require('express').Router();
const parseSchedule = require('../models/parsers/scheduleParser');
const parseCourses = require('../models/parsers/courseParser');

ParseRouter.post('/schedule', function(req, res) {
	const schedule = parseSchedule(req.body.text);
	res.json(schedule);
});

ParseRouter.post('/courses', function(req, res) {
	const courses = parseCourses(req.body.text);
	res.json(courses);
});

module.exports = ParseRouter;
