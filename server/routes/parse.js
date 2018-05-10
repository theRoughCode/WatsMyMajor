const ParseRouter = require('express').Router();
const parseText = require('../models/parser');

ParseRouter.post('/', function(req, res) {
	parseText(req.body.text, json => res.json(json));
});

module.exports = ParseRouter;
