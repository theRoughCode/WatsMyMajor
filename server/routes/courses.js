const CoursesRouter = require('express').Router();
const courses = require('../core/courses');
const courseClassesDB = require('../database/classes');
const courseRatingsDB = require('../database/courseRatings');
const requisitesDB = require('../database/requisites');

// Get search results for query string and max number of results
CoursesRouter.get('/query/:query/:num', async function(req, res) {
  const query = req.params.query;
  const num = req.params.num;

  const { err, result } = await courses.searchCourses(query, num);
  if (err) res.status(400).send(err);
  else res.json(result);
});

// Get information about course
CoursesRouter.get('/info/:subject/:catalogNumber', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const catalogNumber = req.params.catalogNumber;

  // Get course information
  let { err, course } = await courses.getCourseInfo(subject.toUpperCase(), catalogNumber);
  if (err) return res.status(400).send(err);
  const {
    // academicLevel,
    description,
    crosslistings,
    notes,
    terms,
    title,
    units,
    url,
  } = course;

  // Get course requisites
  let reqs = null;
  ({ err, reqs } = await requisitesDB.getRequisites(subject, catalogNumber));
  if (err) res.status(400).send(err);

  const prereqs = (reqs != null) ? reqs.prereqs : {};
  const coreqs = (reqs != null) ? reqs.coreqs : [];
  const antireqs = (reqs != null) ? reqs.antireqs : [];
  let rating = null;

  ({ err, rating } = await courseRatingsDB.getCourseRatings(subject, catalogNumber));
  if (err) res.status(400).send(err);

  const postreqs = (reqs != null) ? reqs.postreqs : {};

  res.json({
    description,
    crosslistings: crosslistings || '',
    notes: notes || '',
    terms: terms || [],
    title,
    units,
    url,
    rating,
    prereqs: prereqs || {},
    coreqs: coreqs || [],
    antireqs: antireqs || [],
    postreqs: postreqs || {},
  });
});

// Get classes for a course
CoursesRouter.get('/classes/:term/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber, term } = req.params;
  const { err, classes } = await courseClassesDB.getClasses(subject.toUpperCase(), catalogNumber, term);
  if (err) res.status(400).send(err);
  else res.json(classes);
});

module.exports = CoursesRouter;
