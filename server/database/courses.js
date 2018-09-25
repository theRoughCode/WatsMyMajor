const { coursesRef } = require('./index');

const coursesForSearch = [];

/* A list of the courses available
    {
      subject: {
        catalogNumber: title
      }
    }
*/

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

// Retrieves all courses as strings to be used for search
async function getCoursesForSearch() {
  // Get cached courses if cached
  if (coursesForSearch.length > 0) return { err: null, courses: coursesForSearch };

  try {
    const snapshot = await coursesRef.once('value');
    const courses = snapshot.val();
    const subjects = Object.keys(courses);
    subjects.forEach(subject => {
      const catalogNumbers = Object.keys(courses[subject]);
      catalogNumbers.forEach(catalogNumber => {
        const { title } = courses[subject][catalogNumber];
        coursesForSearch.push({ subject, catalogNumber, title });
      });
    });
    return { err: null, courses: coursesForSearch };
  } catch (err) {
    console.error(err);
    return { err, courses: null };
  }
}

// Returns course information
// { err, course }
async function getCourseInfo(subject, catalogNumber) {
  try {
    const snapshot = await coursesRef
      .child(`${subject}/${catalogNumber}`)
      .once('value');
    const course = await snapshot.val();
    return { err: null, course };
  } catch (err) {
    console.error(err);
    return { err: err.message, course: null };
  }
}

module.exports = {
  setCourseInfo,
  getCoursesForSearch,
  getCourseInfo,
};
