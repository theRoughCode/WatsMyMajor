const TreeRouter = require('express').Router();
const tree = require('../models/tree');

// Get prerequisite tree for course
TreeRouter.get('/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	tree.getPrereqsTree(subject, number, (tree) => {
    res.set('Content-Type', 'application/json');
    res.json(tree);
	});
});

module.exports = TreeRouter;
