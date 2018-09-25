const CourseRatingsRouter = require('express').Router();
const courseRatingsDB = require('../database/courseRatings');

// Updates user rating for a course
CourseRatingsRouter.post('/update/:subject/:catalogNumber', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const catalogNumber = req.params.catalogNumber;
  const username = req.body.username.toLowerCase();
  let rating = req.body.rating;
  if (!subject || Number.isNaN(catalogNumber) || !username || rating == null)
    return res.status(400).send('Missing/invalid fields.');

  rating = Number(rating);
  if (rating < 1 || rating > 5) return res.status(400).send('Rating must be from 1 to 5.');

  const result = await courseRatingsDB.updateUserRating(username, subject, catalogNumber, rating);
  if (result.err) res.status(400).send(err.message);
  else res.json(result.rating);
});

CourseRatingsRouter.get('/:subject/:catalogNumber', async function(req, res) {
  const subject = req.params.subject.toUpperCase();
  const catalogNumber = req.params.catalogNumber;

  if (!subject || Number.isNaN(catalogNumber)) return res.status(400).send('Missing/invalid fields.');
  const { err, rating } = await courseRatingsDB.getCourseRatings(subject, catalogNumber);
  if (err) res.status(400).send(err.message);
  else res.json(rating);
});

module.exports = CourseRatingsRouter;
