const { read } = require('./utils');

function parseCourses(textArr) {
  const courses = {};

  // Populate courses object
  for (let i = 0; i < textArr.length - 3; i += 3) {
    const subject = textArr[i];
    const catalogNumber = textArr[i + 1];

    if (subject !== subject.toUpperCase()) break;

    if (!courses.hasOwnProperty(subject)) {
      // Use sets to prevent dups
      courses[subject] = new Set([ catalogNumber ]);
    } else {
      courses[subject].add(catalogNumber);
    }
  }

  // Convert from set to array
  for (var subject in courses) {
    courses[subject] = Array.from(courses[subject]);
  }

  return courses;
}

function parseText(text, callback) {
  let textArr = text.split(/\n/);
  textArr = read(textArr, 'Groupbox', 0, 1);
  const term = textArr[0];
  textArr = read(textArr, 'Section', 0, 1);
  console.log(textArr)
  const courses = parseCourses(textArr);
  callback({ term, courses });
}


module.exports = parseText;
