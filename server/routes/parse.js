const ParseRouter = require('express').Router();
const parseText = require('../models/parser');

ParseRouter.post('/', function(req, res) {
	console.log(req.body)
	parseText(req.body.text, json => res.json(json));
});

module.exports = ParseRouter;
