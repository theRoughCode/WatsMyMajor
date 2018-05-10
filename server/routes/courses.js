const CoursesRouter = require('express').Router();
const database = require('../models/database');

// Get search results for query string and max number of results
CoursesRouter.get('/query/:query/:num', function(req, res) {
	const query = req.params.query;
	const num = req.params.num;

	database.getSearchResults(query, num, (err, matches) => {
		if (err) res.send(err);
		else res.json(matches);
	});
});

module.exports = CoursesRouter;
