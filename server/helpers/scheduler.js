const schedule = require('node-schedule');
const update = require('../models/update');

// Update taken count of courses
// Runs every midnight
schedule.scheduleJob('0 0 0 * * *', fireDate => {
  /* eslint-disable no-console */
  console.log(`Running nightly cron job for updating popular courses at: ${fireDate}`);
  update.updatePopularCourses();
});

// Update class info for all courses
// Runs every half an hour
schedule.scheduleJob('0 */30 * * * *', fireDate => {
  console.log(`Running half-hourly cron job for updating course classes at: ${fireDate}`);
  update.updateLatestClasses();
});
