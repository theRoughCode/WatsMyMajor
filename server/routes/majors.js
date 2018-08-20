const MajorsRouter = require('express').Router();
const majors = require('../models/database/majors');

// Set major requirements
MajorsRouter.post('/set/:key', async function(req, res) {
  const key = req.params.key;
  const name = req.body.name;
  const faculty = req.body.faculty;
  const url = req.body.url;
  const data = req.body.data;
  if (!key || !name || !url || !data) {
    res.status(400).send('Missing fields');
    return;
  }
  const err = await majors.setMajorRequirements(key, { name, url, faculty, data });
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else res.send(`${name} updated successfully`);
});

// Get major requirements
MajorsRouter.get('/get/:name', async function(req, res) {
  const name = req.params.name;
  if (!name) {
    res.status(400).send('Invalid name');
    return;
  }
  const { err, data } = await majors.getMajorRequirements(name);
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else res.json(data);
});

MajorsRouter.get('/list', async function(req, res) {
  const { err, list } = await majors.getList();
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else res.json(list);
});

module.exports = MajorsRouter;
