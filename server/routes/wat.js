const WatRouter = require('express').Router();
const waterloo = require('../core/waterloo');

WatRouter.get('/info/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber } = req.params;

  const { err, info } = await waterloo.getCourseInformation(subject, catalogNumber);
  if (err) {
    console.error(err);
    return res.status(400).send(err.message);
  }
  res.json(info);
});

WatRouter.get('/reqs/:subject/:catalogNumber', function(req, res) {
  const { subject, catalogNumber } = req.params;

  waterloo.getReqs(subject, catalogNumber, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
    res.json(data);
  });
});


WatRouter.get('/classes/:subject/:catalogNumber', async function(req, res) {
  const { subject, catalogNumber } = req.params;

  const classInfo = await waterloo.getCourseClasses(subject, catalogNumber);
  if (classInfo == null) {
    return res.status(400).send();
  }
  res.json(classInfo);
});

module.exports = WatRouter;
