const { getCourseTitle } = require('../database/courseList');
const { getPrereqs } = require('../database/requisites');

/*
  PROVIDES UTILITY FUNCTIONS FOR OTHER MODULES
*/

// Formats date into MM/DD/YYYY
const formatDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  const yy = date.getFullYear();
  return `${mm}/${dd}/${yy}`;
};

// Separate subject, catalog number, and title from course string
function parseCourse(courseStr) {
  // Get title
  let title = null;
  let index = courseStr.indexOf('-');
  if (index !== -1) {
    title = courseStr.slice(index + 1).trim();
    courseStr = courseStr.slice(0, index).trim();
  }

  // Remove unnecessary whitespace
  courseStr = courseStr.replace(/\s/g, '');

  // Search for numbers
  index = courseStr.search(/[0-9]/);
  if (index === -1)
    return {
      subject: courseStr.toUpperCase(),
      catalogNumber: '',
    };

  const subject = courseStr.slice(0, index).toUpperCase();
  const catalogNumber = courseStr.slice(index);

  return {
    subject,
    catalogNumber,
    title,
  };
}

// Nests "choose" requisites
function nestReqs(reqArr) {
  if (!Array.isArray(reqArr)) return {};

  // Array is of the form [number, ...]
  const isChoose = !isNaN(reqArr[0]);
  let choose = 0;

  if (isChoose) {
    choose = Number(reqArr[0]);
    reqArr = reqArr.slice(1);
  }

  const reqs = reqArr.map((req) => Array.isArray(req) ? nestReqs(req) : parseCourse(req));

  return { choose, reqs };
}

// Format requisites into required structure
//  { subject, catalogNumber }
function parseReqs(arr) {
  return arr.reduce((acc, req, index) => {
    if (typeof req === 'string') {
      req = unpick(req);
      // add course subject for those without
      if (index > 0 && !req.subject) {
        let prev = acc[acc.length - 1];
        if (Array.isArray(prev)) prev = prev[prev.length - 1]; // get last elem
        req.subject = prev.subject;
      }
    }
    acc.push(req);
    return acc;
  }, []);
}

// Splits MATH235 into [ MATH, 235 ]
function splitSubject(subjectStr) {
  const index = /[0-9]/i.exec(subjectStr).index;
  if (index === 0) return [subjectStr];
  return [subjectStr.substring(0, index), subjectStr.substring(index)];
}

// Iterates through subject string arr and fills in missing subject
// i.e. ['MATH237', '235'] => [{ subject: MATH, catalogNumber: 237}, { subject: MATH, catalogNumber: 235}]
function fillInSubject(subjectStrArr) {
  let prevSubject = '';
  return subjectStrArr.map((str) => {
    const reqStrArr = splitSubject(str);
    // Add subject to front if subject is missing
    if (reqStrArr.length === 1) {
      return { subject: prevSubject, catalogNumber: reqStrArr[0] };
    } else {
      prevSubject = reqStrArr[0];
      return { subject: reqStrArr[0], catalogNumber: reqStrArr[1] };
    }
  });
}

// Converts weird data formatting to pick format
function unpick(str) {
  str = str.replace(/\s*and\s*/g, ',');

  if (str.includes('of')) {
    var choose = str.slice(0, 3);
    switch (choose) {
    case 'One':
      choose = 1;
      break;
    case 'Two':
      choose = 2;
      break;
    case 'All':
      choose = null;
      break;
    default:
      return str;
    }
    const arr = str.slice(6, -1).replace(/\s+/g, '').replace('/', ',').split(',');
    return { choose, reqs: fillInSubject(arr) };
  } else if (str.includes(' or')) {
    // ASSUMING ONLY ONE GROUP OF 'or'
    let open = str.indexOf('(');
    let close = str.indexOf(')');
    if (open === -1 || close === -1) close = str.length;
    // replace ' or ' with comma and split into array.  Also remove periods
    const chooseReqs = str
      .slice(open + 1, close)
      .replace(/\sor\s/g, ', ')
      .replace(/(\s|\.)/g, '')
      .split(',');
    const arr = [
      {
        choose: 1,
        reqs: fillInSubject(chooseReqs),
      },
    ];

    if (!str.includes('[')) return arr[0];

    // Remove special chars
    /* eslint-disable no-useless-escape */
    const checkSpecial = new RegExp('[^A-z0-9,]|s', 'g');
    // remove 'arr' from original string and exclude commas before and after
    str = str.replace(/ *\([^)]*\) */g, '');
    const reqsArr = str
      .replace(checkSpecial, '')
      .split(',')
      .filter((r) => r.length > 0);
    arr.push(...fillInSubject(reqsArr));
    return arr;
  } else return parseCourse(str);
}

function flattenPrereqs(prereqs) {
  if (prereqs == null || !Object.keys(prereqs).length) return [];

  // Base case: course
  if (prereqs.hasOwnProperty('subject')) {
    const { subject, catalogNumber } = prereqs;
    return [{ subject, catalogNumber }];
  }

  // Inductive case: list of courses
  if (prereqs.hasOwnProperty('reqs')) {
    // flatten map
    return [].concat.apply(
      [],
      prereqs.reqs.map((req) => flattenPrereqs(req))
    );
  }

  console.error('Unknown format', prereqs);
  return [];
}

// Used when setting user's courselist/cart
async function fillCoursesMetadata(courses) {
  if (!courses) return courses;

  return Promise.all(
    courses.map(async function (course) {
      let { subject, catalogNumber, prereqs, title } = course;
      let err = null;

      // Fill prereqs
      if (prereqs == null || prereqs.length === 0) {
        // console.log('fill prereqs')
        let reqs = {};
        ({ err, reqs } = await getPrereqs(subject, catalogNumber));
        if (err) {
          console.error(err);
          return course;
        }
        // We want to flatten the prereqs of each course and attach them to the course
        // to be used as a course card.
        prereqs = flattenPrereqs(reqs);
      }

      // Fill course title
      if (title == null || title === '') {
        // console.log('fill title')
        ({ err, title } = await getCourseTitle(subject, catalogNumber));
        if (err) {
          console.error(err);
          return course;
        }
      }

      return { subject, catalogNumber, title, prereqs };
    })
  );
}

async function fillCourseListMetadata(courseList) {
  if (courseList == null) return null;
  return Promise.all(
    courseList.map(async ({ term, level, courses }) => {
      courses = await fillCoursesMetadata(courses);
      return { term, level, courses };
    })
  );
}

async function fillCartMetadata(cart) {
  if (cart == null) return null;
  return fillCoursesMetadata(cart);
}

function stripCoursesMetadata(courses) {
  if (!courses) return courses;
  return courses.map(({ subject, catalogNumber }) => {
    return { subject, catalogNumber };
  });
}

function stripCourseListMetadata(courseList) {
  if (courseList == null) return null;
  return courseList.map(({ term, level, courses }) => {
    courses = stripCoursesMetadata(courses) || [];
    if (term == null) term = 'My Term Board';
    if (level == null) level = '1A';
    return { term, level, courses };
  });
}

function stripCartMetadata(cart) {
  if (cart == null) return null;
  return stripCoursesMetadata(cart);
}

module.exports = {
  formatDate,
  parseCourse,
  nestReqs,
  parseReqs,
  unpick,
  fillCourseListMetadata,
  fillCartMetadata,
  stripCourseListMetadata,
  stripCartMetadata,
};
