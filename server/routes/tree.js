const TreeRouter = require('express').Router();
const tree = require('../models/tree');

// Get prerequisite tree for course
TreeRouter.get('/:subject/:number', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const number = req.params.number;

  const reqTree = await tree.getPrereqsTree(subject, number);
  res.json(reqTree);
});

module.exports = TreeRouter;
