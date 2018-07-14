const StatsRouter = require('express').Router();
const waterloo = require('../models/waterloo');
const users = require('../models/database/users');
const stats = require('../models/database/stats');

StatsRouter.get('/update/popular', async function(req, res) {
	let { err, courseCount } = await users.getAllUserCourses();
	if (err) {
		console.log(err);
		res.status(404).send(err.message);
		return;
	}

	// Assignment without declaration
	({ err } = await stats.updateMostPopular(courseCount));
	if (err) {
		console.log(err);
		res.status(404).send(err.message);
	} else {
		res.json(courseCount);
	}
});

StatsRouter.get('/retrieve/popular/:limit', async function(req, res) {
  const limitStr = req.params.limit;
  const limit = parseInt(limitStr);

  if (!Number.isInteger(limit)) {
    res.status(400).send('Limit provided is not an integer');
    return;
  }
  const { err, results } = await stats.getMostPopular(limit);
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else res.json(results);
});

function getCourseInfo(subject, catalogNumber) {
  return new Promise((resolve) =>
    waterloo.getCourseDescription(subject, catalogNumber, (err, info) => {
      if (err) {
        console.error(err);
        resolve({ subject, catalogNumber });
      } else resolve(info);
    }));
}

// Gets top 3 most popular courses from database and returns information
StatsRouter.get('/courses/popular', async function(req, res) {
  const { err, results } = await stats.getMostPopular(3);
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else {
    const courses = await Promise.all(Object.keys(results).map(courseStr => {
      const [subject, catalogNumber] = courseStr.split("-");
      return getCourseInfo(subject, catalogNumber);
    }));
    res.json(courses);
  }
})

module.exports = StatsRouter;
