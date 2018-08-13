const { read } = require('./utils');

// We verify a subject by checking if it's in all caps
function isSubject(subject) {
  return subject === subject.toUpperCase();
}

// Returns { subject, catalogNumber } from course string, or null if invalid
// e.g. "CS 135 Designing Functional Programs 0.50 0.50 94"
function parseCourse(courseStr) {
  if (courseStr == null) return null;
  const courseStrArr = courseStr.split(" ");
  if (courseStrArr.length < 2) return null;
  const subject = courseStrArr[0];
  if (!isSubject(subject)) return null;
  const catalogNumber = courseStrArr[1];
  return { subject, catalogNumber };
}

function parseTerm(termText) {
  if (!termText) return null;

  const termObj = {};
  const termTextArr = termText.split(/\n/);
  termObj.term = termTextArr[0];
  // e.g. " Level: 1A Load: Full-Time Form Of Study: Enrolment" => 1A
  const regexArr = termTextArr[2].match(/\d(A|B)/);
  if (!regexArr) return null;
  termObj.level = regexArr[0];

  // Get courses
  const courses = [];
  for (let i = 4; i < termTextArr.length; i++) {
    const courseStr = termTextArr[i];
    const course = parseCourse(courseStr);
    if (course == null) break;
    courses.push(course);
  }
  termObj.courses = courses;

  return termObj;
}

function parseText(text, callback) {
  let textArr = text.split(/\n\n/).slice(2);
  return textArr.map(parseTerm).filter(term => term != null);
}


module.exports = parseText;
