const CoursesRouter = require('express').Router();
const courses = require('../models/database/courses');

// Get search results for query string and max number of results
CoursesRouter.get('/query/:query/:num', async function(req, res) {
	const query = req.params.query;
	const num = req.params.num;

	const { err, result } = await courses.searchCourses(query, num);
	if (err) res.status(400).send(err);
	else res.json(result);
});

module.exports = CoursesRouter;
