// Finds first elem with substr and removes all preceding elems
function read(textArr, substr, start = 0, offset = 0) {
  const index = textArr.findIndex((str, idx) => idx >= start && str.includes(substr));
  return textArr.slice(index + offset);
}

function parseComponent(arr) {
  if (arr.length < 7) return null;
  const classNum = arr[0];
  if (!classNum.length) return null;
  const section = arr[1];
  const type = arr[2];
  const dayArr = arr[3].split(' ');
  const days = dayArr[0].split(/(?=[A-Z])/);
  const startTime = dayArr[1];
  const endTime = dayArr[3];
  const location = arr[4].replace(/\s+/, ' ');
  const instructor = arr[5].replace(/\n/g, ' ');
  const dateArr = arr[6].split(' ');
  const startDate = dateArr[0];
  const endDate = dateArr[2];
  return {
    type,
    info: {
      classNum,
      section,
      days,
      startTime,
      endTime,
      location,
      instructor,
      startDate,
      endDate
    }
  };
}

function parseCourses(textArr) {
  const courses = [];
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
    for (var i = 0; i < classArr.length; i += 7) {
      const component = parseComponent(classArr.slice(i, i + 7));
      if (component != null) classes[component.type] = component.info;
    }
    courses.push({
      subject,
      catalogNumber,
      classes
    });
  }
  return courses;
}

function parseText(text, callback) {
  let textArr = text.split(/(?<!\,)\n/g);
  textArr = read(textArr, '| University of Waterloo');

  const term = textArr[0].slice(0, textArr[0].indexOf('|') - 1);
  textArr = read(textArr, 'Status\t', 0, -1);

  const courses = parseCourses(textArr);

  callback({
    term,
    courses
  });
}

module.exports = parseText;
