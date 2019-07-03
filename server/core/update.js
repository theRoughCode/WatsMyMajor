const asyncjs = require('async');
const email = require('./email');
const waterloo = require('./waterloo');
const courses = require('./courses');
const classScraper = require('./scrapers/classes');
const profScraper = require('./scrapers/prof');
const classesDB = require('../database/classes');
const courseListDB = require('../database/courseList');
const courseRatingsDB = require('../database/courseRatings');
const profsDB = require('../database/profs');
const requisitesDB = require('../database/requisites');
const reviewsDB = require('../database/reviews');
const statsDB = require('../database/stats');
const usersDB = require('../database/users');
const watchlistDB = require('../database/watchlist');

/****************************
 *                          *
 *    C O U R S E L I S T   *
 *                          *
 ****************************/

// Updates list of courses.
// This maintains the source of truth for the list of courses
// that the other tables rely on.
function updateCourseList() {
  return new Promise((resolve, reject) => {
    waterloo.getCourses(async function(err, data) {
      if (err) return resolve(err);

      await Promise.all(data.map(async ({ subject, catalog_number, title }) => {
        await courseListDB.setCourse(subject, catalog_number, title);
      }));
      /* eslint-disable no-console */
      console.log(`Finished updating course list at ${new Date()}`);
      resolve(null);
    });
  });
}

/****************************
 *                          *
 *      C O U R S E S       *
 *                          *
 ****************************/

// Updates individual course information
async function updateCourseInformation(subject, catalogNumber) {
  const { err, info } = await waterloo.getCourseInformation(subject, catalogNumber);
  if (err) return err;

  try {
    await courses.setCourseInfo(subject, catalogNumber, info);
    return null;
  } catch (err) {
    console.error(err);
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
            failedList.push({ subject, catalogNumber: catalog_number, err });
            callback();
          });
      }, err => {
        /* eslint-disable no-console */
        console.log(`Finished updating all course information at ${new Date()}`);
        if (err) {
          console.error(err);
          resolve({ err, failedList });
        } else resolve();
      });
    });
  });
}

/****************************
 *                          *
 *    R E Q U I S I T E S   *
 *                          *
 ****************************/

// Updates individial course requisite
function updateCourseRequisite(subject, catalogNumber) {
  return new Promise((resolve, reject) => {
    waterloo.getReqs(subject, catalogNumber, async function(err, reqs) {
      if (err) return reject(err);
      else {
        let { prereqs, coreqs, antireqs } = reqs;

        // No requisities
        if (prereqs.length + coreqs.length + antireqs.length === 0)
          return resolve();

        try {
          // Store prereqs in database
          await requisitesDB.setPrereqs(subject, catalogNumber, prereqs);

          // Store coreqs in database
          await requisitesDB.setCoreqs(subject, catalogNumber, coreqs);

          // Store antireqs in database
          await requisitesDB.setAntireqs(subject, catalogNumber, antireqs);
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
    const courses = await courseListDB.getCourseList();
    const failedList = [];

    return new Promise((resolve, reject) => {
      asyncjs.forEachOfLimit(courses, 100, ({ subject, catalogNumber }, _, callback) => {
        // Get course reqs
        updateCourseRequisite(subject, catalogNumber)
          .then(err => {
            if (err) {
              console.error(`${subject} ${catalogNumber}: ${err}`);
            }
            callback();
          })
          .catch(err => {
            console.error(`${subject} ${catalogNumber}: ${err}`);
            failedList.push({ subject, catalogNumber, err });
            callback();
          });
      }, err => {
        /* eslint-disable no-console */
        console.log(`Finished updating all course requisites at ${new Date()}`);
        if (err) {
          console.error('\n\n\n\n', err);
          resolve({ err, failedList: null });
        } else {
          resolve({ err: null, failedList });
        }
      });
    });
  } catch (err) {
    console.error(err);
    return { err, failedList: null };
  }
}

/****************************
 *                          *
 *      P O P U L A R       *
 *                          *
 ****************************/

// Updates database with count of all users courses
async function updatePopularCourses() {
  let { err, courseCount } = await usersDB.getAllUserCourses();
  if (err) {
    console.error(err);
    return { err, courseCount: null };
  }

  // Assignment without declaration
  err = await statsDB.updateMostPopular(courseCount);
  if (err) {
    console.error(err);
    return { err, courseCount: null };
  } else return { err: null, courseCount };
}

/****************************
 *                          *
 *        R A T I N G       *
 *                          *
 ****************************/

// Updates database with count of all users courses
async function updateCourseRatings() {
  let { err, courseRatings } = await courseRatingsDB.getAllCourseRatings();
  if (err) {
    console.error(err);
    return { err, courseRatings: null };
  }

  // Assignment without declaration
  err = await statsDB.updateRatings(courseRatings);
  if (err) {
    console.error(err);
    return { err, courseRatings: null };
  } else return { err: null, courseRatings };
}

/****************************
 *                          *
 *      C L A S S E S        *
 *                          *
 ****************************/

// Update classes for individial course
async function updateClass(subject, catalogNumber, term) {
  const { err, classInfo } = await classScraper.getClassInfo(subject, catalogNumber, term);
  if (err) return err;

  try {
    await classesDB.setClasses(subject, catalogNumber, term, classInfo);
    asyncjs.forEachOf(classInfo, (info, _, callback) => {
      info.subject = subject;
      info.catalogNumber = catalogNumber;
      updateWatchlist(term, info);
    }, err => {
      if (err) return err;
      else return null;
    });
  } catch (err) {
    return err;
  }
}

// Update classes for all courses
// Returns { err, failedList }
function updateAllClasses(term) {
  const failedList = [];
  try {
    return new Promise(async (resolve, reject) => {
      const courses = await courseListDB.getCourseList();
      asyncjs.forEachOfLimit(courses, 100, ({ subject, catalogNumber }, _, callback) => {
        updateClass(subject, catalogNumber, term)
          .then(callback)
          .catch(err => {
            console.error(`${subject} ${catalogNumber}: ${err}`);
            failedList.push({ subject, catalogNumber, err });
            callback(err);
          });
      }, err => {
        if (err) {
          resolve({ err, failedList });
        }
        else resolve({ err: null, failedList });
      });
    });
  } catch (err) {
    console.error(err);
    return { err, failedList: null };
  }
}

// Update classes for latest term
async function updateLatestClasses() {
  try {
    const term = process.env.CURRENT_TERM;
    await updateAllClasses(term);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

/****************************
 *                          *
 *    P R O F E S S O R     *
 *                          *
 ****************************/

// Update profs that taught this course
async function updateProfClasses(subject, catalogNumber, term) {
  const { err, classInfo } = await classScraper.getClassInfo(subject, catalogNumber, term);
  if (err) return err;

  const promises = [];
  const profs = {};

  classInfo.forEach(c => c.classes.forEach(cl => {
    const { instructor } = cl;
    if (instructor == null || instructor.length === 0) return;
    if (profs.hasOwnProperty(instructor)) return;
    profs[instructor] = true;
    promises.push(profsDB.setProfClasses(instructor, subject, catalogNumber, term));
  }));

  try {
    await Promise.all(promises);
    return null;
  } catch(err) {
    console.error(`${term} | ${subject} ${catalogNumber}: ${err}`);
    return err;
  }
}

// Update professors for all courses in term
async function updateTermProfClasses(term) {
  return new Promise(async (resolve, reject) => {
    const courses = await courseListDB.getCourseList();
    asyncjs.forEachOfLimit(courses, 100, ({ subject, catalogNumber }, _, callback) => {
      updateProfClasses(subject, catalogNumber, term)
        .then(callback)
        .catch(err => callback(err));
    }, err => {
      if (err) resolve(err);
      else resolve(null);
    });
  });
}

// Update all profs
async function updateAllProfs() {
  let term = 1159;
  const maxTerm = process.env.CURRENT_TERM;
  try {
    while (term <= maxTerm) {
      await updateTermProfClasses(term);
      term += 4;
      if (term % 10 === 3) term -= 2;
    }
    return null;
  } catch (err) {
    return err;
  }
}

// Update RMP information for prof
async function updateProfRmp(profName) {
  const { err, prof } = await profScraper.getRmpInfo(profName);
  if (err) return { profName, err };

  const {
    reviews,
    rating,
    difficulty,
    tags,
    rmpURL,
  } = prof;

  try {
    await profsDB.setRMP(profName, rmpURL, tags, rating, difficulty, reviews.length);
    const { err, reviewIds } = await reviewsDB.getRmpReviewIds(profName);
    if (err) return { profName, err };
    const promises = reviews
      .filter(r => !reviewIds.includes(r.id))
      .map(r => reviewsDB.setRmpReview(profName, r));
    await Promise.all(promises);
    return null;
  } catch (err) {
    console.error(err);
    return { profName, err };
  }
}

async function updateAllProfsRmp() {
  const CHUNK_SIZE = 100;
  const { err, profList } = await profsDB.getProfList();
  if (err) return { err, failedList: [] };

  // divide promises into batches of CHUNK_SIZE
  const { acc } = profList.reduce(({ acc, num }, val) => {
    if (num <= CHUNK_SIZE) {
      acc[acc.length - 1].push(val);
      return { acc, num: num + 1 };
    } else {
      acc.push([val]);
      return { acc, num: 1 };
    }
  }, { acc: [[]], num: 0 });

  try {
    let failedList = [];
    for (let i = 0; i < acc.length; i++) {
      const promises = acc[i].map(name => updateProfRmp(name));
      const list = await Promise.all(promises);
      failedList = failedList.concat(list);
    }
    /* eslint-disable no-console */
    console.log(`Finished updating all prof reviews at ${new Date()}`);
    return { err: null, failedList };
  } catch(err) {
    console.error(err);
    return { err, failedList: [] };
  }
}


/****************************
 *                          *
 *      H E L P E R S       *
 *                          *
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

    await requisitesDB.setPostreq(subject, catalogNumber, postreq, choose, alternatives);
  }
}

// Helper function for updateClass
// Updates watchlist enrollment numbers and notifies watchers if necessary
async function updateWatchlist(term, classInfo) {
  const {
    classNumber,
    subject,
    catalogNumber,
    enrollmentCap,
    enrollmentTotal,
  } = classInfo;

  let { enrollment, err } = await watchlistDB.getEnrollment(term, classNumber);
  if (err) return err;

  // If no change, return
  if (enrollment != null &&
      enrollmentCap === enrollment.enrollmentCap &&
      enrollmentTotal === enrollment.enrollmentTotal
  ) {
    /* eslint-disable no-console */
    // console.log(`Skipping class ${classNumber}...`);
    return;
  }

  // Else, update enrollment results
  const promises = [
    watchlistDB.setSubject(term, classNumber, subject),
    watchlistDB.setCatalogNumber(term, classNumber, catalogNumber),
    watchlistDB.setEnrollment(term, classNumber, { enrollmentCap, enrollmentTotal }),
  ];
  await Promise.all(promises);

  // Nothing to compare to
  if (enrollment == null) return;

  let watchers = null;
  ({ watchers, err } = await watchlistDB.getWatchers(term, classNumber));
  if (err) return err;
  if (watchers == null || watchers.length === 0) return;

  // Notify watchers if there are spaces
  const openings = enrollmentCap - enrollmentTotal;
  if (openings > 0) {
    watchers.forEach(username => {
      email.sendClassUpdateEmail(term, classNumber, subject.toUpperCase(), catalogNumber, openings, username);
    });
  }
  return;
}


module.exports = {
  updateCourseList,
  updateCourseInformation,
  updateAllCourses,
  updateCourseRequisite,
  updateAllRequisites,
  updatePopularCourses,
  updateCourseRatings,
  updateClass,
  updateAllClasses,
  updateLatestClasses,
  updateProfClasses,
  updateTermProfClasses,
  updateAllProfs,
  updateProfRmp,
  updateAllProfsRmp,
};
