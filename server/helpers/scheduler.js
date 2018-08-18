const schedule = require('node-schedule');
const update = require('../models/update');

// Update taken count of courses
// Runs every midnight
schedule.scheduleJob('0 0 0 * * *', update.updatePopularCourses);
