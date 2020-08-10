const { coursesRef } = require('./index');

/****************************
 *                          *
 *      S E T T E R S       *
 *                          *
 ****************************/

function setCourseInfo(subject, catalogNumber, info) {
  return coursesRef.child(`${subject}/${catalogNumber}`).set(info);
}

/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

// Returns course information
// { err, course }
async function getCourseInfo(subject, catalogNumber) {
  try {
    const snapshot = await coursesRef.child(`${subject}/${catalogNumber}`).once('value');
    const course = await snapshot.val();
    return { err: null, course };
  } catch (err) {
    console.error(err);
    return { err: err.message, course: null };
  }
}

module.exports = {
  setCourseInfo,
  getCourseInfo,
};
