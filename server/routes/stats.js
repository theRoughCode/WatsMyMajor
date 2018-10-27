const StatsRouter = require('express').Router();
const coursesDB = require('../database/courses');
const statsDB = require('../database/stats');
const usersDB = require('../database/users');

// Retrieves the top "limit" courses from the database
StatsRouter.get('/course/popular/:limit', async function(req, res) {
  const limitStr = req.params.limit;
  const limit = parseInt(limitStr);

  if (!Number.isInteger(limit)) {
    res.status(400).send('Limit provided is not an integer');
    return;
  }
  const { err, results } = await statsDB.getMostPopular(limit);
  const popular = Object.keys(results).map(courseStr => {
    const [subject, catalogNumber] = courseStr.split("-");
    const count = results[courseStr];
    return {
      subject,
      catalogNumber,
      count,
    };
  });
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else res.json(popular);
});

// Gets top 8 most popular courses from database and returns information
StatsRouter.get('/course/popular', async function(req, res) {
  let { err, results } = await statsDB.getMostPopular(8);
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else {
    const popularCourses = await Promise.all(Object.keys(results).map(async (courseStr) => {
      const [subject, catalogNumber] = courseStr.split("-");
      let course = null;
      ({ err, course } = await coursesDB.getCourseInfo(subject, catalogNumber))
      if (err) {
        console.error(err);
        res.status(404).send(err.message);
      }
      const { title, description } = course;
      return { subject, catalogNumber, title, description };
    }));
    res.json(popularCourses);
  }
});

// Retrieves the top "limit" courses from the database
StatsRouter.get('/course/ratings/:limit', async function(req, res) {
  const limitStr = req.params.limit;
  const limit = parseInt(limitStr);

  if (!Number.isInteger(limit)) {
    res.status(400).send('Limit provided is not an integer');
    return;
  }
  const { err, results } = await statsDB.getMostRated(limit);
  const popular = Object.keys(results).map(courseStr => {
    const [subject, catalogNumber] = courseStr.split("-");
    const rating = results[courseStr];
    return {
      subject,
      catalogNumber,
      rating,
    };
  });
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else res.json(popular);
});

// Gets top 8 most rated courses from database and returns information
StatsRouter.get('/course/ratings', async function(req, res) {
  let { err, results } = await statsDB.getMostRated(8);
  if (err) {
    console.error(err);
    res.status(404).send(err.message);
  } else {
    const ratedCourses = await Promise.all(Object.keys(results).map(async (courseStr) => {
      const [subject, catalogNumber] = courseStr.split("-");
      let course = null;
      ({ err, course } = await coursesDB.getCourseInfo(subject, catalogNumber))
      if (err) {
        console.error(err);
        res.status(404).send(err.message);
      }
      const { title, description } = course;
      return { subject, catalogNumber, title, description };
    }));
    res.json(ratedCourses);
  }
});

// Get number of users
StatsRouter.get('/users/count', async function(req, res) {
  const num = await usersDB.getNumUsers();
  res.json({ num });
});

module.exports = StatsRouter;
