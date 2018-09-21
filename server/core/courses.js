const fuzzy = require('fuzzy');
const coursesDB = require('../database/courses');

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
    const { err, courses } = await coursesDB.getCoursesForSearch();
    if (err) return { err, result: null };

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

function setCourses(courses) {
  return coursesDB.setCourses(courses);
}

function setCourseInfo(subject, catalogNumber, info) {
  return coursesDB.setCourseInfo(subject, catalogNumber, info);
}

function getCourseInfo(subject, catalogNumber) {
  return coursesDB.getCourseInfo(subject, catalogNumber);
}

module.exports = {
  searchCourses,
  setCourses,
  setCourseInfo,
  getCourseInfo,
};
