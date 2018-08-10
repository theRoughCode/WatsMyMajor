const moment = require('moment');
const { read } = require('./utils');

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

function parseCourses(textArr) {
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

function parseText(text) {
  // We might get instructors separated by commas on different lines. We want
  // to detect any commas followed by a new line and combine them.
  text = text.replace(/,\s*(\r|\n|\r\n)\s*/g, ',');
  let textArr = text.split(/\n/g);
  textArr = read(textArr, '| University of Waterloo');

  const term = textArr[0].slice(0, textArr[0].indexOf('|') - 1);
  textArr = read(textArr, 'Status\t', 0, -1);

  const courses = parseCourses(textArr);

  return { term, courses };
}

module.exports = parseText;
