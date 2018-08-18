const UpdateRouter = require('express').Router();
const update = require('../models/update');

// Update database for courses
UpdateRouter.get('/courses/all', async function(req, res) {
	req.setTimeout(0); // disables timeout
	res.set('Content-Type', 'application/json');
	const err = await update.updateAllCourses();
	if (err) res.json({ success: false, err });
	else res.json({ success: true });
});

UpdateRouter.get('/courses/:subject/:catalogNumber', async function(req, res) {
	const { subject, catalogNumber } = req.params;
	req.setTimeout(0); // disables timeout
	res.set('Content-Type', 'application/json');
	const err = await update.updateCourseInformation(subject.toUpperCase(), String(catalogNumber));
	if (err) res.json({ success: false, err });
	else res.json({ success: true });
});

// Update requisites for all courses
UpdateRouter.get('/requisite/all', async function(req, res) {
	req.setTimeout(0); // disables timeout
	res.set('Content-Type', 'application/json');
	const { err, failedList } = await update.updateAllRequisites();
	if (err) res.json({ success: false, err });
	else res.json({ success: true, failedList });
});

// Update requisites for a particular course
UpdateRouter.get('/requisite/:subject/:catalogNumber', async function(req, res) {
	const { subject, catalogNumber } = req.params;
	req.setTimeout(0); // disables timeout
	res.set('Content-Type', 'application/json');
	const err = await update.updateCourseRequisite(subject.toUpperCase(), String(catalogNumber));
	if (err) res.send({ success: false, err });
	else res.send({ success: true });
});

module.exports = UpdateRouter;
