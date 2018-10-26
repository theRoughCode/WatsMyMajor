const CoursesRouter = require('express').Router();
const courses = require('../core/courses');
const courseClassesDB = require('../database/classes');
const courseListDB = require('../database/courseList');

// Get search results for query string and max number of results
CoursesRouter.get('/query/:query/:num', async function(req, res) {
  const query = req.params.query;
  const num = req.params.num;

  const { err, result } = await courses.searchCourses(query, num);
  if (err) res.status(400).send(err);
  else res.json(result);
});

// Gets list of all courses
CoursesRouter.get('/all', async function (req, res) {
  const courseList = await courseListDB.getCourseList();
  res.json(courseList);
});

// Gets course title
CoursesRouter.get('/title/:subject/:catalogNumber', async function (req, res) {
  const subject = req.params.subject.toUpperCase();
  const catalogNumber = req.params.catalogNumber;

  const { err, title } = await courseListDB.getCourseTitle(subject, catalogNumber);
  if (err) res.status(400).send(err);
  else res.send(title);
});

// Get information about course
CoursesRouter.get('/info/:subject/:catalogNumber', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const catalogNumber = req.params.catalogNumber;

  // Get course information
  let { err, info } = await courses.getCourseInfo(subject.toUpperCase(), catalogNumber);
  if (err) return res.status(400).send(err.message);
  else res.json(info);
});

// Get classes for a course
CoursesRouter.get('/classes/:term/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber, term } = req.params;
  const { err, classes } = await courseClassesDB.getClasses(subject.toUpperCase(), catalogNumber, term);
  if (err) res.status(400).send(err);
  else res.json(classes);
});

module.exports = CoursesRouter;
