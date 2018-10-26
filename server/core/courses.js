const fuzzy = require('fuzzy');
const requisites = require('./requisites');
const coursesDB = require('../database/courses');
const courseListDB = require('../database/courseList');
const courseRatingsDB = require('../database/courseRatings');

// Extractors for fuzzy searching
const simpleExtractor = ({ subject, catalogNumber }) => subject + ' ' + catalogNumber;
const titleExtractor = ({ subject, catalogNumber, title }) => subject + ' ' + catalogNumber + ' - ' + title;

// Returns true if array contains course
const containsCourse = ({ subject, catalogNumber }, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].subject === subject && arr[i].catalogNumber === catalogNumber) return true;
  }
  return false;
}

// Searches courses with query and a specified number of results to return
async function searchCourses(query, limit) {
  try {
    const courses = await courseListDB.getCourseList();

    // If query length is <= 5, only search by subject and catalogNumber.
    // Else include title in search as well.
    const extract = (query.length <= 5) ? simpleExtractor : titleExtractor;
    const result = [];
    let fuzzyResults = fuzzy.filter(query, courses, { extract });
    for (let i = 0; i < fuzzyResults.length; i++) {
      if (result.length >= limit) break;
      const course = fuzzyResults[i].original;
      if (!containsCourse(course, result)) result.push(course);
    }
    // If using simple extractor and not enough to populate results, use title extractor.
    if (query.length <= 5 && result.length < limit) {
      fuzzyResults = fuzzy.filter(query, courses, { extract: titleExtractor });
      for (let i = 0; i < fuzzyResults.length; i++) {
        if (result.length >= limit) break;
        const course = fuzzyResults[i].original;
        if (!containsCourse(course, result)) result.push(course);
      }
    }
    return { err: null, result };
  } catch (err) {
    console.error(err);
    return { err, result: null };
  }
}

/*
Course Info: {
  title,
  units,
  description,
  crosslistings,
  terms,
  notes,
  url,
  academicLevel
}
*/

function setCourseInfo(subject, catalogNumber, {
  title,
  units,
  description,
  crosslistings,
  terms,
  notes,
  url,
  academicLevel
}) {
  const info = {
    title,
    units,
    description,
    crosslistings,
    terms,
    notes,
    url,
    academicLevel,
  };
  return coursesDB.setCourseInfo(subject, catalogNumber, info);
}

async function getCourseInfo(subject, catalogNumber) {
  // Get course information
  let { err, course } = await coursesDB.getCourseInfo(subject, catalogNumber);
  if (err || course == null) return { err, info: null };

  const {
    // academicLevel,
    description,
    crosslistings,
    notes,
    terms,
    title,
    units,
    url,
  } = course;

  // Get course requisites
  let reqs = null;
  ({ err, reqs } = await requisites.getFormattedReqs(subject, catalogNumber));
  if (err) return { err, info: null };

  let rating = null;
  ({ err, rating } = await courseRatingsDB.getCourseRatings(subject, catalogNumber));
  if (err) return { err, info: null };

  return {
    err: null,
    info: {
      description,
      crosslistings: crosslistings || '',
      notes: notes || '',
      terms: terms || [],
      title,
      units,
      url,
      rating,
      prereqs: reqs.prereqs,
      coreqs: reqs.coreqs,
      antireqs: reqs.antireqs,
      postreqs: reqs.postreqs,
    },
  };
}



module.exports = {
  searchCourses,
  setCourseInfo,
  getCourseInfo,
};
