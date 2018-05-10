const UpdateRouter = require('express').Router();
const database = require('../models/database');

// Update database for courses or requisites
UpdateRouter.get('/:type/:subject/:catalogNumber?', function(req, res) {
	const type = req.params.type.toLowerCase();

	req.setTimeout(0); // disables timeout
	res.set('Content-Type', 'application/json');
	if (type === 'course') {
		database.updateCourseList(err => {
			if (err) res.json({ success: false, err });
			else res.json({ success: true });
		});
	} else if (type === 'requisite') {
		const { subject, catalogNumber } = req.params;

		if (subject === 'all') {
			database.updateRequisites((err, failedList) => {
				if (err) res.json({ success: false, err });
				else res.json({ success: true, failedList });
			});
		} else {
			database.updateCourseRequisite(subject.toUpperCase(), String(catalogNumber), err => {
				if (err) res.send({ success: false, err });
				else res.send({ success: true });
			});
		}
	} else res.send({ success: false, err: 'Invalid type.' });
});

module.exports = UpdateRouter;
