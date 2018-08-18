const CoursesRouter = require('express').Router();
const waterloo = require('../models/waterloo');
const courses = require('../models/database/courses');
const requisites = require('../models/database/requisites');

// Get search results for query string and max number of results
CoursesRouter.get('/query/:query/:num', async function(req, res) {
	const query = req.params.query;
	const num = req.params.num;

	const { err, result } = await courses.searchCourses(query, num);
	if (err) res.status(400).send(err);
	else res.json(result);
});

CoursesRouter.get('/info/:subject/:catalogNumber', async function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const catalogNumber = req.params.catalogNumber;

	// Get course information
	let { err, course } = await courses.getCourseInfo(subject.toUpperCase(), catalogNumber);
	if (err) return res.status(400).send(err);
	const {
		description,
		crosslistings,
		notes,
		terms_offered,
		title,
		units,
		url,
	} = course;

	// Get course requisites
	({ err, reqs } = await requisites.getRequisites(subject, catalogNumber));
	if (err) res.status(400).send(err);

	// Get course classes
	// TODO: Move to database
	const classList = await waterloo.getCourseClasses(subject, catalogNumber);
	res.json({
		description,
		crosslistings: crosslistings || '',
		notes: notes || '',
		termsOffered: terms_offered,
		title,
		units,
		url,
		prereqs: reqs.prereqs || {},
		coreqs: reqs.coreqs || [],
		antireqs: reqs.antireqs || [],
		postreqs: reqs.postreqs || {},
		classList
	});
});

module.exports = CoursesRouter;
