const ParseRouter = require('express').Router();
const parseSchedule = require('../models/parsers/scheduleParser');
const parseCourses = require('../models/parsers/courseParser');

ParseRouter.post('/schedule', function(req, res) {
	parseSchedule(req.body.text, json => res.json(json));
});

ParseRouter.post('/courses', function(req, res) {
	parseCourses(req.body.text, json => res.json(json));
});

module.exports = ParseRouter;
