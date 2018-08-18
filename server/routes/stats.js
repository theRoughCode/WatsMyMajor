const StatsRouter = require('express').Router();
const courses = require('../models/database/courses');
const stats = require('../models/database/stats');
const scheduler = require('../helpers/scheduler');

// Updates count of all users' courses
StatsRouter.get('/update/popular', async function(req, res) {
	const { err, courseCount } = await scheduler.updatePopularCourses();
	if (err) return res.status(404).send(err.message);
	res.json(courseCount);
});

// Retrieves the top "limit" courses from the database
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

// Gets top 3 most popular courses from database and returns information
StatsRouter.get('/courses/popular', async function(req, res) {
  let { err, results } = await stats.getMostPopular(3);
  if (err) {
    console.log(err);
    res.status(404).send(err.message);
  } else {
    const popularCourses = await Promise.all(Object.keys(results).map(async (courseStr) => {
      const [subject, catalogNumber] = courseStr.split("-");
			({ err, course } = await courses.getCourseInfo(subject, catalogNumber))
			if (err) {
		    console.log(err);
		    res.status(404).send(err.message);
		  }
			const { title, description } = course;
			return { subject, catalogNumber, title, description };
    }));
    res.json(popularCourses);
  }
})

module.exports = StatsRouter;
