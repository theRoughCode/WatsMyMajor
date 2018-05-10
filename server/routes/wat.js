const WatRouter = require('express').Router();
const waterloo = require('../models/waterloo');

// Get Course Information
WatRouter.get('/:subject/:number', function(req, res){
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');

	waterloo.getReqs(subject, number, (err, info) => {
		if (err) return res.status(404).json({ success: false, err });

		waterloo.getParentReqs(subject, number, parents => {
			waterloo.getCourseInfo(subject, number, classes => {
				info["parPrereq"] = (parents[0].length > 0) ? parents[0] : [];
				info["parCoreq"] = (parents[1].length > 0) ? parents[1] : [];
				info["classList"] = classes;
				res.json(info);
			});
		});
	});
});

// Get classes from course
WatRouter.get('/class/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');
	waterloo.getCourseInfo(subject, number, classes => {
		res.json(classes);
	});
});


module.exports = WatRouter;
