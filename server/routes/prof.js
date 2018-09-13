const ProfRouter = require('express').Router();
const rmp = require('../models/scrapers/rmp');

// Get professor rating from ratemyprofessors.com
ProfRouter.get('/:name', async function(req, res) {
  const name = req.params.name;
  res.set('Content-Type', 'application/json');
  const { err, prof } = await rmp.getProfInfo(name);
  if (err) res.status(400).send(err.message);
  else res.json(prof);
});

module.exports = ProfRouter;
