const moment = require('moment');
const { read } = require('./utils');
const { getClasses } = require('../../database/classes');

// Returns true if start date is before end date using format
function isBefore(startDate, endDate, format) {
  const startDateMoment = moment(startDate, format);
  const endDateMoment = moment(endDate, format);
  return startDateMoment.isBefore(endDateMoment);
}

// Tries to determine format of date string.  If it cannot determine, returns ''.
function parseDate(dateStr) {
  if (!dateStr) return '';
  const dateArr = dateStr.split('/');
  if (dateArr.length !== 3) return '';

  let yearIndex = -1;
  let monthIndex = -1;
  let dayIndex = -1;

  dateArr.forEach((numStr, idx) => {
    const num = Number(numStr);
    if (num > 31) yearIndex = idx;
    else if (num > 12) dayIndex = idx;
    else monthIndex = idx;
  });

  // Can't say for sure which format it is
  if (yearIndex === -1 || monthIndex === -1 || dayIndex === -1) return '';
  const formatArr = new Array(3);
  formatArr[yearIndex] = 'YYYY';
  formatArr[monthIndex] = 'MM';
  formatArr[dayIndex] = 'DD';
  return formatArr.join('/');
}

// Try to get date format given start and end date strings
// Returns '' if cannot determine format
function getDateFormat(startDate, endDate) {
  // Try getting format from start date
  let dateFormat = parseDate(startDate);
  if (dateFormat !== '') return dateFormat;

  // If unsuccessful, try end date
  dateFormat = parseDate(endDate);
  if (dateFormat !== '') return dateFormat;

  // If still unsuccessful, try comparing dates
  dateFormat = 'DD/MM/YYYY';
  if (isBefore(startDate, endDate, dateFormat)) return dateFormat;
  dateFormat = 'MM/DD/YYYY';
  if (isBefore(startDate, endDate, dateFormat)) return dateFormat;

  // Give up
  return '';
}

// Formats date strings into date objects for a course
function formatDates(course, format) {
  if (format === '') format = 'DD/MM/YYYY';  // How it should be
  for (let compName in course.classes) {
    const comp = course.classes[compName];

    if (comp.hasOwnProperty('startDate')) {
      const startDate = moment(comp.startDate, format);
      course.classes[compName].startDate = {
        day: startDate.date(),
        month: startDate.month() + 1, // zero-indexed
        year: startDate.year(),
      };
    }

    if (comp.hasOwnProperty('endDate')) {
      const endDate = moment(comp.endDate, format);
      course.classes[compName].endDate = {
        day: endDate.date(),
        month: endDate.month() + 1, // zero-indexed
        year: endDate.year(),
      };
    }
  }
  return course;
}

function parseComponent(arr) {
  if (arr.length < 7) return null;
  const classNum = arr[0];
  if (!classNum.length) return null;
  const section = arr[1];
  const type = arr[2];
  const dayArr = arr[3].split(' ');
  const days = (!dayArr[0].length || dayArr[0] === 'TBA') ? [] : dayArr[0].split(/(?=[A-Z])/);
  const startTime = moment(dayArr[1], "hh:mmA");
  if (!startTime.isValid()) return null;  // Don't need to parse if cannot get time
  const endTime = moment(dayArr[3], "hh:mmA");
  if (!endTime.isValid()) return null;
  const location = (arr[4] === 'TBA') ? '' : arr[4].replace(/\s+/, ' ');
  const instructor = arr[5].replace(/,/g, ', ');
  const dateArr = arr[6].split(' ');
  const startDate = dateArr[0];
  const endDate = dateArr[2];
  return {
    type,
    info: {
      classNum,
      section,
      days,
      startTime: {
        hour: startTime.hour(),
        min: startTime.minute(),
      },
      endTime: {
        hour: endTime.hour(),
        min: endTime.minute(),
      },
      location,
      instructor,
      startDate,
      endDate
    }
  };
}

function parseCourses1(textArr) {
  const courses = [];
  let dateFormat = '';
  let index = textArr.findIndex(str => str.includes('Status\t'));
  while (index > -1) {
    const courseArr = textArr[index - 1].split(' ');
    textArr = textArr.slice(index);
    const subject = courseArr[0];
    const catalogNumber = courseArr[1];
    index = textArr.findIndex(str => str.includes('Class Nbr\t'));
    textArr = textArr.slice(index + 1);
    const newIndex = textArr.findIndex(str => str.includes('Status\t'));
    const classArr = textArr.slice(0, newIndex - 1);
    index = newIndex;
    const classes = {};
    for (let i = 0; i < classArr.length; i += 7) {
      const component = parseComponent(classArr.slice(i, i + 7));
      if (component == null) continue;
      // Try to parse date format if hasn't been determined yet
      // We need this because Quest is bad and formats dates in different formats
      // for different students.
      const { startDate, endDate } = component.info;
      if (dateFormat === '') dateFormat = getDateFormat(startDate, endDate);
      if (component != null && component.type.length > 0) classes[component.type] = component.info;
    }
    courses.push({
      subject,
      catalogNumber,
      classes
    });
  }
  return courses.map(course => formatDates(course, dateFormat));
}

// Parse based on class schedule
function parseSchedule1(text) {
  // We might get instructors separated by commas on different lines. We want
  // to detect any commas followed by a new line and combine them.
  text = text.replace(/,\s*(\r|\n|\r\n)\s*/g, ',');
  let textArr = text.split(/\n/g);
  textArr = read(textArr, '| University of Waterloo');

  const term = textArr[0].slice(0, textArr[0].indexOf('|') - 1);
  textArr = read(textArr, 'Status\t', 0, -1);

  const courses = parseCourses1(textArr);

  return { term, courses };
}

function getTermInfo(termStr) {
  const termStrArr = termStr.split(" ");
  // Invalid term
  if (termStrArr.length !== 2) return process.env.CURRENT_TERM;

  let term = '1' + termStrArr[1].slice(2);
  const startDate = {
    day: 1,
    month: 1,
    year: 2018
  };
  const endDate = {
    day: 1,
    month: 1,
    year: 2018
  };
  switch (termStrArr[0]) {
  case 'Winter':
    term += '1';
    startDate.day = 7;
    startDate.month = 1;
    startDate.year = termStrArr[1];
    endDate.day = 5;
    endDate.month = 4;
    endDate.year = termStrArr[1];
    break;
  case 'Spring':
    term += '5';
    startDate.day = 6;
    startDate.month = 5;
    startDate.year = termStrArr[1];
    endDate.day = 30;
    endDate.month = 7;
    endDate.year = termStrArr[1];
    break;
  default:
    term += '9';
    startDate.day = 6;
    startDate.month = 9;
    startDate.year = termStrArr[1];
    endDate.day = 3;
    endDate.month = 12;
    endDate.year = termStrArr[1];
  }
  return {
    term,
    startDate,
    endDate
  };
}

function parseTimeSlot(timeSlot) {
  let { endTime, instructor, location, startTime, weekdays } = timeSlot;
  startTime = moment(startTime, "HH:mm");
  if (!startTime.isValid()) return {};
  endTime = moment(endTime, "HH:mm");
  if (!endTime.isValid()) return {};
  return {
    days: weekdays,
    startTime: {
      hour: startTime.hour(),
      min: startTime.minute(),
    },
    endTime: {
      hour: endTime.hour(),
      min: endTime.minute(),
    },
    location,
    instructor
  };
}

async function getClass(subject, catalogNumber, section, termInfo) {
  const { term, startDate, endDate } = termInfo;
  const classObj = { subject, catalogNumber, term, type: '', classInfo: {} };
  try {
    let { err, classes } = await getClasses(subject, catalogNumber, term);
    if (err) {
      console.error(err);
      return classObj;
    }
    for (let i = 0; i < classes.length; i++) {
      const sectionArr = classes[i].section.split(" ");
      if (sectionArr.length !== 2) return classObj;
      if (sectionArr[1] !== section) continue;
      classObj.type = sectionArr[0];
      const timeSlot = parseTimeSlot(classes[i].classes[0]);
      if (timeSlot == null) break;
      classObj.classInfo['classNum'] = classes[i].classNumber;
      classObj.classInfo['section'] = section;
      classObj.classInfo['days'] = timeSlot.days;
      classObj.classInfo['startTime'] = timeSlot.startTime;
      classObj.classInfo['endTime'] = timeSlot.endTime;
      classObj.classInfo['location'] = timeSlot.location;
      classObj.classInfo['instructor'] = timeSlot.instructor;
      classObj.classInfo['startDate'] = startDate;
      classObj.classInfo['endDate'] = endDate;
      break;
    }
    return classObj;
  } catch (e) {
    console.error(e);
    return classObj;
  }
}

async function parseCourses2(textArr, termInfo) {
  const courses = [];
  const promises = [];
  for (let i = 0; i < textArr.length; i++) {
    if (textArr[i].startsWith('Unsuccessful')) break;
    const subject = textArr[i++];
    const catalogNumber = textArr[i++];
    const section = textArr[i];
    promises.push(getClass(subject, catalogNumber, section, termInfo));
  }
  const result = await Promise.all(promises);
  const coursesObj = {};
  result.forEach(c => {
    const { subject, catalogNumber,  type, classInfo } = c;
    if (!coursesObj.hasOwnProperty(subject)) coursesObj[subject] = {};
    if (!coursesObj[subject].hasOwnProperty(catalogNumber)) coursesObj[subject][catalogNumber] = {
      classes: {},
    };
    coursesObj[subject][catalogNumber].classes[type] = classInfo;
  });
  Object.keys(coursesObj).forEach(subject => {
    Object.keys(coursesObj[subject]).forEach((catalogNumber) => {
      courses.push({
        subject,
        catalogNumber,
        classes: coursesObj[subject][catalogNumber].classes,
      });
    });
  });
  return courses;
}

// Parse based on class schedule
async function parseSchedule2(text) {
  let textArr = text.split(/\n/g);
  textArr = read(textArr, 'My Class Enrollment Results');
  textArr = read(textArr, 'Groupbox');
  const term = textArr[1].trim();
  const termInfo = getTermInfo(term);
  textArr = read(textArr, 'Section', 0, 1);
  const courses = await parseCourses2(textArr, termInfo);

  return { term, courses };
}

async function parseText(text) {
  if (text.includes('List View')) return parseSchedule1(text);
  else return parseSchedule2(text);
}

module.exports = parseText;
