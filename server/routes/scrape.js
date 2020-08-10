const ScrapeRouter = require('express').Router();
const classes = require('../core/scrapers/classes');
const majors = require('../core/scrapers/majors');

// Scrape ADM and get classes
ScrapeRouter.get('/classes/:term/:subject/:catalogNumber', async function (req, res) {
  const { subject, catalogNumber, term } = req.params;
  const { err, classInfo } = await classes.getClassInfo(subject, catalogNumber, term);
  if (err) res.status(400).send(err.message);
  else res.json(classInfo);
});

// Scrape requisites from website
ScrapeRouter.post('/majors', async function (req, res) {
  const url = req.body.url;
  if (!url) {
    res.status(400).send('URL required.');
    return;
  }

  const result = await majors.parseMajor(req.body.url);
  res.json(result);
});

module.exports = ScrapeRouter;
