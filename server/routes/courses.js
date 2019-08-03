const passport = require('passport');
const CoursesRouter = require('express').Router();
const courses = require('../core/courses');
const reviewsCore = require('../core/reviews');
const courseClassesDB = require('../database/classes');
const courseListDB = require('../database/courseList');

// Get search results for query string and max number of results
CoursesRouter.get('/query/:query/:num', async function(req, res) {
  const query = req.params.query;
  const num = req.params.num;
  const courseOnly = JSON.parse(req.query.courseOnly);

  const { err, result } = await courses.searchCourses(query, num, courseOnly);
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

// Get reviews for a course
CoursesRouter.get('/reviews/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber } = req.params;
  const { err, reviews } = await reviewsCore.getCourseReviews(subject.toUpperCase(), catalogNumber);
  if (err) res.status(400).send(err);
  else res.json(reviews);
});

// Add course review
CoursesRouter.post('/reviews/:subject/:catalogNumber/add',
  passport.authenticate('jwt', { session: false }),
  async function(req, res) {
    const username = req.user;
    const { subject, catalogNumber } = req.params;
    const review = Object.assign({}, req.body);

    try {
      let err =  await reviewsCore.addCourseReview(subject.toUpperCase(), catalogNumber, username, review);
      if (err) return res.status(400).send(err);
      return res.status(200).send('Review added');
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  });

// Delete prof review
CoursesRouter.delete('/reviews/:subject/:catalogNumber/remove',
  passport.authenticate('jwt', { session: false }),
  async function(req, res) {
    const username = req.user;
    const { subject, catalogNumber } = req.params;

    try {
      let err =  await reviewsCore.deleteCourseReview(subject.toUpperCase(), catalogNumber, username);
      if (err) {
        console.error(err);
        return res.status(400).send(err);
      }
      return res.status(200).send('Review removed');
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  });

// Add prof review vote
CoursesRouter.post('/reviews/:subject/:catalogNumber/vote',
  passport.authenticate('jwt', { session: false }),
  async function(req, res) {
    const username = req.user;
    const { subject, catalogNumber } = req.params;
    const { id, vote } = Object.assign({}, req.body);

    try {
      let err = await reviewsCore.addCourseReviewVote(subject.toUpperCase(), catalogNumber, id, username, vote);
      if (err) return res.status(400).send(err);
      return res.status(200).send('Vote added');
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  });

module.exports = CoursesRouter;
