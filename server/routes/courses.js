const CoursesRouter = require('express').Router();
const waterloo = require('../models/waterloo');
const courses = require('../models/database/courses');
const courseClasses = require('../models/database/classes');
const requisites = require('../models/database/requisites');

// Get search results for query string and max number of results
CoursesRouter.get('/query/:query/:num', async function(req, res) {
	const query = req.params.query;
	const num = req.params.num;

	const { err, result } = await courses.searchCourses(query, num);
	if (err) res.status(400).send(err);
	else res.json(result);
});

// Get information about course
CoursesRouter.get('/info/:subject/:catalogNumber', async function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const catalogNumber = req.params.catalogNumber;

	// Get course information
	let { err, course } = await courses.getCourseInfo(subject.toUpperCase(), catalogNumber);
	if (err) return res.status(400).send(err);
	const {
		academicLevel,
		description,
		crosslistings,
		notes,
		terms,
		title,
		units,
		url,
	} = course;

	// Get course requisites
	({ err, reqs } = await requisites.getRequisites(subject, catalogNumber));
	if (err) res.status(400).send(err);

	res.json({
		description,
		crosslistings: crosslistings || '',
		notes: notes || '',
		terms: terms || [],
		title,
		units,
		url,
		prereqs: reqs.prereqs || {},
		coreqs: reqs.coreqs || [],
		antireqs: reqs.antireqs || [],
		postreqs: reqs.postreqs || {},
	});
});

// Get classes for a course
CoursesRouter.get('/classes/:term/:subject/:catalogNumber', async function(req, res) {
	const { subject, catalogNumber, term } = req.params;
	const { err, classes } = await courseClasses.getClasses(subject.toUpperCase(), catalogNumber, term);
	if (err) res.status(400).send(err);
	else res.json(classes);
});

module.exports = CoursesRouter;
