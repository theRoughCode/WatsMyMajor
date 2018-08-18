const asyncjs = require('async');
const waterloo = require('./waterloo');
const courses = require('./database/courses');
const requisites = require('./database/requisites');
const stats = require('../models/database/stats');
const users = require('../models/database/users');

/****************************
 *													*
 *			C O U R S E S 			*
 *													*
 ****************************/

// Updates individual course information
async function updateCourseInformation(subject, catalogNumber) {
	const { err, info } = await waterloo.getCourseInformation(subject, catalogNumber);
	if (err) return err;

	try {
		console.log(`\nUpdating: ${subject} ${catalogNumber}`);
		await courses.setCourseInfo(subject, catalogNumber, info);
		return null;
	} catch (err) {
		console.log(err);
		return err;
	}
}

// Updates all course information
function updateAllCourses() {
	const failedList = [];
	return new Promise((resolve, reject) => {
		waterloo.getCourses(function(err, data) {
			if (err) return resolve({ err, failedList: null });

			asyncjs.forEachOfLimit(data, 10, (courseData, index, callback) => {
				const { subject, catalog_number } = courseData;
				updateCourseInformation(subject, catalog_number)
					.then(() => callback())
					.catch(err => {
						failedList.push({ subject, catalogNumber, err });
						callback();
					});
			}, err => {
				console.log(err);
				if (err) resolve({ err, failedList });
				else resolve();
			});
		});
	});
}

// Updates individial course requisite
function updateCourseRequisite(subject, catalogNumber) {
  return new Promise((resolve, reject) => {
    waterloo.getReqs(subject, catalogNumber, async function(err, reqs) {
  		if (err) return resolve(err);
  		else {
  			console.log(`\nUpdating: ${subject} ${catalogNumber}`);

  			let { prereqs, coreqs, antireqs } = reqs;

  			// No requisities
  			if (prereqs.length + coreqs.length + antireqs.length === 0)
  				return resolve();

        try {
          // Store prereqs in database
          await requisites.setPrereqs(subject, catalogNumber, prereqs);

          // Store coreqs in database
          await requisites.setCoreqs(subject, catalogNumber, coreqs);

          // Store antireqs in database
          await requisites.setAntireqs(subject, catalogNumber, antireqs);
        } catch (err) {
          return resolve(err);
        }


  			// Store parent requisites in database
  			if (!prereqs.length && !Object.keys(prereqs).length) return resolve();

  			const choose = prereqs.choose;
  			prereqs = prereqs.reqs;

        const postreq = { subject, catalogNumber };
        await Promise.all(prereqs.map(async (prereq) => {
          await storePostreqs(choose, prereqs, postreq, prereq);
        }));

        resolve();
  		}
  	});
  });
}

// Get courses from courseList and updates all course requisites
async function updateAllRequisites() {
  try {
    const reqsSnapshot = await requisites.getRequisitesSnapshot();
    const failedList = [];
    const reqs = reqsSnapshot.val();
    const subjects = Object.keys(reqs);

    return new Promise((resolve, reject) => {
      asyncjs.forEachOfLimit(reqs, 10, (courses, subject, subjectCallback) => {
        asyncjs.forEachOfLimit(courses, 10, (_, catalogNumber, catNumCallback) => {
          // Get course reqs
          updateCourseRequisite(subject, catalogNumber)
            .then(err => {
              if (err) {
                console.log(`${subject} ${catalogNumber}: ${err}`);
              }
              catNumCallback();
            })
            .catch(err => {
              console.log(`${subject} ${catalogNumber}: ${err}`);
              failedList.push({ subject, catalogNumber, err });
              catNumCallback();
            });
        }, err => {
          if (err) subjectCallback(err);
          else subjectCallback(null);
        });
      }, err => {
        if (err) {
          console.log('\n\n\n\n', err);
          resolve({ err, failedList: null });
        } else {
          console.log('Done updating course requisites! :D');
          console.log(`There were a total of ${failedList.length} errors.`);
          resolve({ err: null, failedList });
        }
      });
    });
  } catch (err) {
    console.log(err);
    return { err, failedList: null };
  }
}

// Updates database with count of all users courses
async function updatePopularCourses() {
  console.log('Running nightly cron job for updating popular courses...')
  let { err, courseCount } = await users.getAllUserCourses();
	if (err) {
		console.log(err);
		return { err, courseCount: null };
	}

	// Assignment without declaration
	({ err } = await stats.updateMostPopular(courseCount));
	if (err) {
		console.log(err);
    return { err, courseCount: null };
	} else return { err: null, courseCount };
}


/****************************
 *													*
 *			H E L P E R S 			*
 *													*
 ****************************/

// Helper function for update Course Requisites
// Store post reqs in database
// TODO: Rethink schema to be similar to coreqs/antireqs: [{ subject, catalogNumber }]
async function storePostreqs(choose, prereqs, postreq, prereq) {
	// Nested Requisite
	if (prereq.hasOwnProperty('choose')) {
		choose = prereq.choose;
		prereqs = prereq.reqs;

   await Promise.all(prereqs.map(async (prereq) => {
     await storePostreqs(choose, prereqs, postreq, prereq);
   }));
	} else {
		const { subject, catalogNumber } = prereq;
		const alternatives = prereqs.filter(req => req.subject !== subject || req.catalogNumber !== catalogNumber);

   await requisites.setPostreq(subject, catalogNumber, postreq, choose, alternatives);
	}
}


module.exports = {
  updateCourseInformation,
	updateAllCourses,
  updateCourseRequisite,
  updateAllRequisites,
	updatePopularCourses,
};
