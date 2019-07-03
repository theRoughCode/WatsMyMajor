const UpdateRouter = require('express').Router();
const update = require('../core/update');

// Update list of courses
UpdateRouter.get('/courselist', async function(req, res) {
  const err = await update.updateCourseList();
  if (err) res.status(400).json({ success: false, err });
  else res.json({ success: true });
});

// Update database for courses
UpdateRouter.get('/courses/all', async function(req, res) {
  req.setTimeout(0); // disables timeout
  const err = await update.updateAllCourses();
  if (err) res.json({ success: false, err });
  else res.json({ success: true });
});

UpdateRouter.get('/courses/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber } = req.params;
  const err = await update.updateCourseInformation(subject.toUpperCase(), String(catalogNumber));
  if (err) res.json({ success: false, err });
  else res.json({ success: true });
});

// Update requisites for all courses
UpdateRouter.get('/requisite/all', async function(req, res) {
  req.setTimeout(0); // disables timeout
  const { err, failedList } = await update.updateAllRequisites();
  if (err) res.json({ success: false, err });
  else res.json({ success: true, failedList });
});

// Update requisites for a particular course
UpdateRouter.get('/requisite/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber } = req.params;
  const err = await update.updateCourseRequisite(subject.toUpperCase(), String(catalogNumber));
  if (err) res.send({ success: false, err });
  else res.send({ success: true });
});

// Updates classes for all courses
UpdateRouter.get('/classes/:term/all', async function(req, res) {
  const { term } = req.params;
  req.setTimeout(0); // disables timeout
  const { err, failedList } = await update.updateAllClasses(term);
  if (err) res.send({ success: false, err });
  else res.send({ success: true, failedList });
});

// Updates classes for a particular course
UpdateRouter.get('/classes/:term/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber, term } = req.params;
  const err = await update.updateClass(subject, catalogNumber, term);
  if (err) res.send({ success: false, err });
  else res.send({ success: true });
});

// Updates professors for all courses across all terms
UpdateRouter.get('/profs/all', async function(req, res) {
  req.setTimeout(0); // disables timeout
  const err = await update.updateAllProfs();
  if (err) res.send({ success: false, err });
  else res.send({ success: true, err: null });
});

// Updates professors for all courses in a term
UpdateRouter.get('/profs/:term/all', async function(req, res) {
  const { term } = req.params;
  req.setTimeout(0); // disables timeout
  const err = await update.updateTermProfClasses(term);
  if (err) res.send({ success: false, err });
  else res.send({ success: true, err: null });
});

// Updates professors for a particular course
UpdateRouter.get('/profs/:term/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber, term } = req.params;
  const err = await update.updateProfClasses(subject, catalogNumber, term);
  if (err) res.send({ success: false, err });
  else res.send({ success: true });
});

// Updates professors for a particular course
UpdateRouter.get('/reviews/prof/rmp/all', async function(req, res) {
  const { err, failedList } = await update.updateAllProfsRmp();
  if (err) res.send({ success: false, err, failedList });
  else res.send({ success: true });
});

// Updates professors for a particular course
UpdateRouter.get('/reviews/prof/rmp/:profName', async function(req, res) {
  const { profName } = req.params;
  const err = await update.updateProfRmp(profName);
  if (err) res.send({ success: false, err });
  else res.send({ success: true });
});

// Updates count of all users' courses
UpdateRouter.get('/popular', async function(req, res) {
  const { err, courseCount } = await update.updatePopularCourses();
  if (err) return res.status(404).send(err.message);
  res.json(courseCount);
});

// Updates ratings of courses
UpdateRouter.get('/ratings', async function(req, res) {
  const { err, courseRatings } = await update.updateCourseRatings();
  if (err) return res.status(404).send(err.message);
  res.json(courseRatings);
});

module.exports = UpdateRouter;
