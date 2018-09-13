const ReqsRouter = require('express').Router();
const requisites = require('../models/database/requisites');

// Get requisites from course
ReqsRouter.get('/:subject/:number', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const number = req.params.number;

  const { err, reqs } = await requisites.getRequisites(subject, number);
  if (err) {
    console.error(err);
    res.send(err);
  } else {
    res.set('Content-Type', 'application/json');
    res.json(reqs);
  }
});

// Get prereqs from course
ReqsRouter.get('/prereqs/:subject/:number', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const number = req.params.number;

  const { err, reqs } = await requisites.getPrereqs(subject, number);
  if (err) {
    console.error(err);
    res.send(err);
  } else {
    res.set('Content-Type', 'application/json');
    res.json(reqs);
  }
});

// Get coreqs from course
ReqsRouter.get('/coreqs/:subject/:number', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const number = req.params.number;

  let { err, reqs } = await requisites.getCoreqs(subject, number);
  if (err) {
    console.error(err);
    res.send(err);
  } else {
    res.set('Content-Type', 'application/json');
    if (reqs == null) reqs = [];
    res.json(reqs);
  }
});

// Get antireqs from course
ReqsRouter.get('/antireqs/:subject/:number', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const number = req.params.number;

  let { err, reqs } = await requisites.getAntireqs(subject, number);
  if (err) {
    console.error(err);
    res.send(err);
  } else {
    res.set('Content-Type', 'application/json');
    if (reqs == null) reqs = [];
    res.json(reqs);
  }
});

// Get postreqs from course
ReqsRouter.get('/postreqs/:subject/:number', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const number = req.params.number;

  let { err, reqs } = await requisites.getPostreqs(subject, number);
  if (err) {
    console.error(err);
    res.send(err);
  } else {
    res.set('Content-Type', 'application/json');
    if (reqs == null) reqs = [];
    res.json(reqs);
  }
});

module.exports = ReqsRouter;
