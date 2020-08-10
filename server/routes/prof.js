const passport = require('passport');
const ProfRouter = require('express').Router();
const profScraper = require('../core/scrapers/prof');
const reviewsCore = require('../core/reviews');
const profsDB = require('../database/profs');

// Get professor list for a course
ProfRouter.get('/list/:subject/:catalogNumber', async function (req, res) {
  const { subject, catalogNumber } = req.params;
  const { err, profList } = await profsDB.getCourseProfs(subject.toUpperCase(), catalogNumber);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(profList);
});

// Get prof id
ProfRouter.get('/id/:name', async function (req, res) {
  const { name } = req.params;
  const { err, prof } = await profsDB.getProfId(name);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(prof);
});

// Get professor rating from ratemyprofessors.com
ProfRouter.get('/rmp/:name', async function (req, res) {
  const name = req.params.name;
  const { err, prof } = await profScraper.getRmpInfo(name);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(prof);
});

// Get prof metadata
ProfRouter.get('/info/:name', async function (req, res) {
  const name = req.params.name;
  const { err, info } = await reviewsCore.getProfInfo(name);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(info);
});

// Get prof names
ProfRouter.post('/names', async function (req, res) {
  const list = Object.assign({}, req.body);
  const { err, names } = await reviewsCore.getProfNames(list);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(names);
});

// Get prof reviews
ProfRouter.get('/reviews/:name', async function (req, res) {
  const name = req.params.name;
  const { err, reviews } = await reviewsCore.getProfReviews(name);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(reviews);
});

// Add prof review
ProfRouter.post(
  '/reviews/:profName/add',
  passport.authenticate('jwt', { session: false }),
  async function (req, res) {
    const username = req.user;
    const profName = req.params.profName;
    const review = Object.assign({}, req.body);

    try {
      let err = await reviewsCore.addProfReview(profName, username, review);
      if (err) return res.status(400).send(err);
      return res.status(200).send('Review added');
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
);

// Delete prof review
ProfRouter.delete(
  '/reviews/:profName/remove',
  passport.authenticate('jwt', { session: false }),
  async function (req, res) {
    const username = req.user;
    const profName = req.params.profName;

    try {
      let err = await reviewsCore.deleteProfReview(profName, username);
      if (err) {
        console.error(err);
        return res.status(400).send(err);
      }
      return res.status(200).send('Review removed');
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
);

// Add prof review vote
ProfRouter.post(
  '/reviews/:profName/vote',
  passport.authenticate('jwt', { session: false }),
  async function (req, res) {
    const username = req.user;
    const profName = req.params.profName;
    const { id, vote } = Object.assign({}, req.body);

    try {
      let err = await reviewsCore.addProfReviewVote(profName, id, username, vote);
      if (err) return res.status(400).send(err);
      return res.status(200).send('Vote added');
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
);

module.exports = ProfRouter;
