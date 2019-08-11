const schedule = require('node-schedule');
const update = require('./update');

// Update popular count of courses
// Runs every midnight
schedule.scheduleJob('0 0 * * *', fireDate => {
  /* eslint-disable no-console */
  console.log(`Running nightly cron job for updating popular courses at: ${fireDate}`);
  update.updatePopularCourses();
});

// Update ratings for courses
// Runs every midnight
schedule.scheduleJob('0 0 * * *', fireDate => {
  /* eslint-disable no-console */
  console.log(`Running nightly cron job for updating course ratings at: ${fireDate}`);
  update.updateCourseRatings();
});

// Update course information
// Runs every month
schedule.scheduleJob('0 0 1 * *', fireDate => {
  /* eslint-disable no-console */
  console.log(`Running monthly cron job for updating course information at: ${fireDate}`);
  update.updateAllCourses();
});

// Update course list
// Runs every month
schedule.scheduleJob('0 0 1 * *', fireDate => {
  /* eslint-disable no-console */
  console.log(`Running monthly cron job for updating course list at: ${fireDate}`);
  update.updateCourseList();
});

// Update course requisites
// Runs every month
schedule.scheduleJob('0 0 1 * *', fireDate => {
  /* eslint-disable no-console */
  console.log(`Running monthly cron job for updating course requisites at: ${fireDate}`);
  update.updateAllRequisites();
});

// Update class info for all courses
// Runs every half an hour
schedule.scheduleJob('*/30 * * * *', fireDate => {
  console.log(`Running half-hourly cron job for updating course classes at: ${fireDate}`);
  update.updateLatestClasses();
});

// Update sitemap XML
// Runs every week
schedule.scheduleJob('0 0 * * 0', fireDate => {
  console.log(`Running weeky cron job for updating sitemap at: ${fireDate}`);
  update.updateXML();
});
