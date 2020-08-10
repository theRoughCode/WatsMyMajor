const requisitesDB = require('../database/requisites');
const courseListDB = require('../database/courseList');

// Formats postreqs obj into arr
const formatPostreqs = (postreqs) => {
  const formatted = [];
  for (let subject in postreqs) {
    for (let catalogNumber in postreqs[subject]) {
      formatted.push({ subject, catalogNumber });
    }
  }
  return formatted;
};

// Fills course array with titles
const fillCourseTitles = async (coursesArr) => {
  if (!coursesArr) return [];
  return Promise.all(
    coursesArr.map(async (course) => {
      if (course.hasOwnProperty('subject')) {
        const { subject, catalogNumber } = course;
        const { err, title } = await courseListDB.getCourseTitle(subject, catalogNumber);
        if (err) {
          console.error(err);
          return {};
        }
        return { subject, catalogNumber, title };
      } else if (course.hasOwnProperty('choose')) {
        let { choose, reqs } = course;
        reqs = await fillCourseTitles(reqs);
        return { choose, reqs };
      } else return course; // string
    })
  );
};

// Returns reqs, but formatted with course titles.
// Used with getCourseInfo
async function getFormattedReqs(subject, catalogNumber) {
  const { err, reqs } = await requisitesDB.getRequisites(subject, catalogNumber);
  if (err || reqs == null)
    return {
      err,
      reqs: { prereqs: {}, coreqs: [], antireqs: [], postreqs: [] },
    };

  let prereqs = reqs.prereqs;
  if (prereqs == null) prereqs = {};
  else prereqs.reqs = await fillCourseTitles(prereqs.reqs);

  let coreqs = reqs.coreqs;
  if (coreqs == null) coreqs = [];
  else coreqs = await fillCourseTitles(coreqs);

  let antireqs = reqs.antireqs;
  if (antireqs == null) antireqs = [];
  else antireqs = await fillCourseTitles(antireqs);

  let postreqs = reqs.postreqs;
  if (postreqs == null) postreqs = [];
  else postreqs = await fillCourseTitles(formatPostreqs(postreqs));

  return {
    err: null,
    reqs: {
      prereqs,
      coreqs,
      postreqs,
      antireqs,
    },
  };
}

module.exports = {
  getFormattedReqs,
};
