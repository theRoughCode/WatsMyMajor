const { courseListRef } = require('./index');

/*
 *  This table stores the comprehensive list of UW courses and
 *  will be the source of truth that the other tables rely on
 *  to populate their data.
 */

let cachedCourseList = [];
let valid = false;

/****************************
 *                          *
 *      S E T T E R S       *
 *                          *
 ****************************/

// Set a course
function setCourse(subject, catalogNumber, title) {
  valid = false;
  return courseListRef.child(`${subject}/${catalogNumber}`).set(title);
}

/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

// Returns course name
async function getCourseTitle(subject, catalogNumber) {
  if (subject.length > 7 || catalogNumber.length > 7)
    return { err: `Invalid course: ${subject} ${catalogNumber}`, title: null };
  try {
    const snapshot = await courseListRef.child(`${subject}/${catalogNumber}`).once('value');
    const title = await snapshot.val();
    return { err: null, title };
  } catch (err) {
    console.error(err);
    return { err: err.message, title: null };
  }
}

// Returns array of courses: { subject, catalogNumber }
async function getCourseList() {
  if (valid) return cachedCourseList; // use cached version if valid flag is true

  const courseList = [];
  const snapshot = await courseListRef.once('value');
  snapshot.forEach((subjectSnapshot) => {
    const subject = subjectSnapshot.key;
    subjectSnapshot.forEach((catalogNumberSnapshot) => {
      const catalogNumber = catalogNumberSnapshot.key;
      courseList.push({ subject, catalogNumber, title: catalogNumberSnapshot.val() });
    });
  });
  cachedCourseList = courseList.slice();
  valid = true;
  return courseList;
}

module.exports = {
  setCourse,
  getCourseTitle,
  getCourseList,
};
