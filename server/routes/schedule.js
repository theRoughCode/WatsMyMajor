const ScheduleRouter = require('express').Router();
const users = require('../core/users');


// Get user schedule
ScheduleRouter.get('/:username', async function(req, res) {
  const username = req.params.username.toLowerCase();
  const { schedule, err } = await users.getUserSchedule(username);
  if (err) {
    console.error(err);
    res.status(400).send(err);
  } else if (schedule == null) res.status(404).send('User schedule not found');
  else res.json(schedule);
});


module.exports = ScheduleRouter;
