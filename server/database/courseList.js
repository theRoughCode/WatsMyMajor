const { courseListRef } = require('./index');

/*
 *  This table stores the comprehensive list of UW courses and
 *  will be the source of truth that the other tables rely on
 *  to populate their data.
 */


/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

// Set a course
// TODO: Use title instead and then use this to search
function setCourse(subject, catalogNumber) {
  return courseListRef
    .child(`${subject}/${catalogNumber}`)
    .set(true);
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Returns array of courses: { subject, catalogNumber }
async function getCourseList() {
  const courseList = [];
  const snapshot = await courseListRef.once('value');
  snapshot.forEach((subjectSnapshot) => {
    const subject = subjectSnapshot.key;
    subjectSnapshot.forEach((catalogNumberSnapshot) => {
      const catalogNumber = catalogNumberSnapshot.key;
      courseList.push({ subject, catalogNumber });
    });
  });
  return courseList;
}

module.exports = {
  setCourse,
  getCourseList,
};
