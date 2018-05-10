const ReqsRouter = require('express').Router();
const database = require('../models/database');

// Get requisites from course
ReqsRouter.get('/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');
	// waterloo.getReqs(subject, number, (err, reqs) => {
	// 	res.json({ err, reqs });
	// });
	database.getRequisites(subject, number, (err, reqs) => {
		if (err) {
			console.error(err);
			res.send(err);
		} else {
			res.set('Content-Type', 'application/json');
			res.json(reqs);
		}
	});
});

// Get prereqs from course
ReqsRouter.get('/prereqs/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	database.getPrereqs(subject, number, (err, prereqs) => {
		if (err) {
			console.error(err);
			res.send(err);
		} else {
			res.set('Content-Type', 'application/json');
			res.json(prereqs);
		}
	});
});

// Get coreqs from course
ReqsRouter.get('/coreqs/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	database.getCoreqs(subject, number, (err, coreqss) => {
		if (err) {
			console.error(err);
			res.send(err);
		} else {
			res.set('Content-Type', 'application/json');
			res.json(coreqss);
		}
	});
});

// Get antireqs from course
ReqsRouter.get('/antireqs/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	database.getAntireqs(subject, number, (err, antireqss) => {
		if (err) {
			console.error(err);
			res.send(err);
		} else {
			res.set('Content-Type', 'application/json');
			res.json(antireqss);
		}
	});
});

// Get postreqs from course
ReqsRouter.get('/postreqs/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	database.getPostreqs(subject, number, (err, postreqs) => {
		if (err) {
			console.error(err);
			res.send(err);
		} else {
			res.set('Content-Type', 'application/json');
			res.json(postreqs);
		}
	});
});

module.exports = ReqsRouter;
