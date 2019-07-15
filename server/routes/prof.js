const passport = require('passport');
const ProfRouter = require('express').Router();
const profScraper = require('../core/scrapers/prof');
const reviewsCore = require('../core/reviews');

// Get professor rating from ratemyprofessors.com
ProfRouter.get('/rmp/:name', async function(req, res) {
  const name = req.params.name;
  const { err, prof } = await profScraper.getRmpInfo(name);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(prof);
});

// Get prof metadata
ProfRouter.get('/info/:name', async function(req, res) {
  const name = req.params.name;
  const { err, info } = await reviewsCore.getProfInfo(name);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(info);
});

// Get prof reviews
ProfRouter.get('/reviews/:name', async function(req, res) {
  const name = req.params.name;
  const { err, reviews } = await reviewsCore.getProfReviews(name);
  res.set('Content-Type', 'application/json');
  if (err) res.status(400).send(err.message);
  else res.json(reviews);
});

// Add prof review
ProfRouter.post('/reviews/:profName/add',
  passport.authenticate('jwt', { session: false }),
  async function(req, res) {
    const username = req.user;
    const profName = req.params.profName;
    const review = Object.assign({}, req.body);

    try {
      let err =  await reviewsCore.addProfReview(profName, username, review);
      if (err) return res.status(400).send(err);
      return res.status(200).send('Review added');
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  });



module.exports = ProfRouter;
