const MajorsRouter = require('express').Router();
const majorsDB = require('../database/majors');

// Set major requirements
MajorsRouter.post('/set/:key', async function (req, res) {
  const key = req.params.key;
  const name = req.body.name;
  const faculty = req.body.faculty;
  const url = req.body.url;
  const data = req.body.data;
  if (!key || !name || !faculty || !url || !data) {
    res.status(400).send('Missing fields');
    return;
  }
  const err = await majorsDB.setMajorRequirements(faculty, key, { name, url, data });
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else res.send(`${name} updated successfully`);
});

// Get major requirements
MajorsRouter.get('/get/:faculty/:name', async function (req, res) {
  const faculty = req.params.faculty;
  const name = req.params.name;
  if (!faculty || !name) {
    res.status(400).send('Missing fields');
    return;
  }
  const { err, data } = await majorsDB.getMajorRequirements(faculty, name);
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else res.json(data);
});

MajorsRouter.get('/list/:faculty', async function (req, res) {
  const faculty = req.params.faculty;
  if (!faculty) {
    res.status(400).send('Missing fields');
    return;
  }
  const { err, majors } = await majorsDB.getMajorsList(faculty);
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else res.json(majors);
});

MajorsRouter.get('/faculties/list', async function (req, res) {
  const { err, list } = await majorsDB.getFacultiesList();
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else res.json(list);
});

MajorsRouter.get('/list', async function (req, res) {
  const { err, list } = await majorsDB.getList();
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else res.json(list);
});

module.exports = MajorsRouter;
