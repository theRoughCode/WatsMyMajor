const ProfRouter = require('express').Router();
const rmp = require('../models/rmp');

// Get professor rating from ratemyprofessors.com
ProfRouter.get('/:name', function(req, res) {
	const name = req.params.name;
	res.set('Content-Type', 'application/json');
	rmp.getProfInfo(name, info => res.json(info));
});

module.exports = ProfRouter;
