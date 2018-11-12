const ParseRouter = require('express').Router();
const parseSchedule = require('../core/parsers/scheduleParser');
const parseCourses = require('../core/parsers/courseParser');
const parseTranscript = require('../core/parsers/transcriptParser');

ParseRouter.post('/schedule', async function(req, res) {
  const schedule = await parseSchedule(req.body.text);
  res.json(schedule);
});

ParseRouter.post('/courses', function(req, res) {
  const courses = parseCourses(req.body.text);
  res.json(courses);
});

// Parse user's transcript into courses (fill up My Courses)
ParseRouter.post('/transcript', function(req, res) {
  const transcript = parseTranscript(req.body.text);
  res.json(transcript);
});

module.exports = ParseRouter;
