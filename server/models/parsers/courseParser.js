const { read } = require('./utils');

function parseCourses(textArr) {
  const courseSet = {};

  // Populate courses object
  for (let i = 0; i < textArr.length - 3; i += 3) {
    const subject = textArr[i];
    const catalogNumber = textArr[i + 1];

    if (subject === 'SEQ') continue;
    if (subject !== subject.toUpperCase()) break;

    if (!courseSet.hasOwnProperty(subject)) {
      // Use sets to prevent dups
      courseSet[subject] = new Set([ catalogNumber ]);
    } else {
      courseSet[subject].add(catalogNumber);
    }
  }

  const courseList = [];
  // Convert from set to array
  for (var subject in courseSet) {
    courseSet[subject].forEach(catalogNumber => courseList.push({ subject, catalogNumber }));
  }

  return courseList;
}

function parseText(text, callback) {
  let textArr = text.split(/\n/).filter(ln => ln.replace(/\t/g, '').length > 0);
  textArr = read(textArr, 'Groupbox', 0, 1);
  const term = textArr[0];
  textArr = read(textArr, 'Section', 0, 1);
  const courses = parseCourses(textArr);
  callback({ term, courses });
}


module.exports = parseText;
