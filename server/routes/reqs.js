const ReqsRouter = require('express').Router();
const requisitesDB = require('../database/requisites');

// Get requisites from course
ReqsRouter.get('/:subject/:number', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const number = req.params.number;

  const { err, reqs } = await requisitesDB.getRequisites(subject, number);
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

  const { err, reqs } = await requisitesDB.getPrereqs(subject, number);
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

  let { err, reqs } = await requisitesDB.getCoreqs(subject, number);
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

  let { err, reqs } = await requisitesDB.getAntireqs(subject, number);
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

  let { err, reqs } = await requisitesDB.getPostreqs(subject, number);
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
