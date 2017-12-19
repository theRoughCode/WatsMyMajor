const routes = require('express').Router();
const path = require('path');
const waterloo = require('../models/waterloo');
const database = require('../models/database');
const rmp = require('../models/rmp');

routes.get('/', function(req, res){
	res.render('index');
});

// Get Course Information
routes.get('/wat/:subject/:number', function(req, res){
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');

	waterloo.getReqInfo(subject, number, output => {
		waterloo.getParentReqs(subject, number, parents => {
			waterloo.getCourseInfo(subject, number, classes => {
				output["parPrereq"] = (parents[0].length > 0) ? parents[0] : [];
				output["parCoreq"] = (parents[1].length > 0) ? parents[1] : [];
				output["classList"] = classes;
				res.json(output);
			});
		});
	});
});

// Get classes from course
routes.get('/wat/class/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');
	waterloo.getCourseInfo(subject, number, classes => {
		res.json(classes);
	});
});

// Get requisites from course
routes.get('/wat/reqs/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');
	waterloo.getReqs(subject, number, (err, reqs) => {
		res.json({ err, reqs });
	});
});

// Get search results for query string and max number of results
routes.get('/courses/query/:query/:num', function(req, res) {
	const query = req.params.query;
	const num = req.params.num;

	database.getSearchResults(query, num, (err, matches) => {
		if (err) res.send(err);
		else res.json(matches);
	});
})

// routes.get('/update/:subject/:number', function(req, res) {
// 	const subject = req.params.subject.toUpperCase();
// 	const number = req.params.number;
//
// 	res.set('Content-Type', 'application/json');
// 	database.updateRequisites(subject, number, err => {
// 		if (err) res.json({ success: false, err });
// 		else res.json({ success: true });
// 	});
// });

// Update database for courses or requisites
routes.get('/update/:type', function(req, res) {
	const type = req.params.type.toLowerCase();

	req.setTimeout(0); // disables timeout
	res.set('Content-Type', 'application/json');
	if (type === 'course') {
		database.updateCourseList(err => {
			if (err) res.json({ success: false, err });
			else res.json({ success: true });
		});
	} else if (type === 'requisite') {
		database.updateRequisites((err, failedList) => {
			if (err) res.json({ success: false, err });
			else res.json({ success: true, failedList });
		});
	} else res.send('Invalid type.');
});


// Get professor rating from ratemyprofessors.com
routes.get('/prof/:name', function(req, res) {
	const name = req.params.name;
	res.set('Content-Type', 'application/json');
	rmp.getProfInfo(name, info => res.json(info));
});

// All remaining requests return the React app, so it can handle routing.
routes.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../../react-ui/build', 'index.html'));
});


module.exports = routes;
