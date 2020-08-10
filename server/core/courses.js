const fuzzy = require('fuzzy');
const requisites = require('./requisites');
const coursesDB = require('../database/courses');
const profsDB = require('../database/profs');
const courseListDB = require('../database/courseList');
const courseRatingsDB = require('../database/courseRatings');

let courseList = [];
let profList = [];

// Extractors for fuzzy searching
const simpleExtractor = ({ subject, catalogNumber, name }) =>
  name == null ? subject + ' ' + catalogNumber : name;
const titleExtractor = ({ subject, catalogNumber, title, name }) =>
  name == null ? subject + ' ' + catalogNumber + ' - ' + title : name;

// Returns true if array contains course
const containsCourse = ({ subject, catalogNumber, name }, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (
      (arr[i].name != null && arr[i].name === name) ||
      (arr[i].subject === subject && arr[i].catalogNumber === catalogNumber)
    )
      return true;
  }
  return false;
};

// Searches courses with query and a specified number of results to return
async function searchCourses(query, limit, courseOnly) {
  try {
    // Cache results
    if (courseList.length === 0) {
      courseList = await courseListDB.getCourseList();
    }
    const queryList = courseList.slice(0);
    if (!courseOnly) {
      if (profList.length === 0) {
        const res = await profsDB.getProfList();
        const err = res.err;
        profList = res.profList;
        if (err) {
          console.error(err);
          return { err, result: null };
        }
      }
      queryList.push(...profList);
    }

    // If query length is <= 5, only search by subject and catalogNumber.
    // Else include title in search as well.
    const extract = query.length <= 5 ? simpleExtractor : titleExtractor;
    const result = [];
    let fuzzyResults = fuzzy.filter(query, queryList, { extract });
    for (let i = 0; i < fuzzyResults.length; i++) {
      if (result.length >= limit) break;
      const item = fuzzyResults[i].original;
      if (!containsCourse(item, result)) result.push(item);
    }
    // If using simple extractor and not enough to populate results, use title extractor.
    if (query.length <= 5 && result.length < limit) {
      fuzzyResults = fuzzy.filter(query, queryList, { extract: titleExtractor });
      for (let i = 0; i < fuzzyResults.length; i++) {
        if (result.length >= limit) break;
        const item = fuzzyResults[i].original;
        if (!containsCourse(item, result)) result.push(item);
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

function setCourseInfo(
  subject,
  catalogNumber,
  { title, units, description, crosslistings, terms, notes, url, academicLevel }
) {
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
  if (err) return { err, info: null };
  if (course == null) return { err: 'No course found', info: null };

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
