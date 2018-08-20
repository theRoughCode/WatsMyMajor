const cheerio = require('cheerio');
const utils = require('./utils');

async function getClassInfo(subject, catalogNumber, term) {
  const url = createURL(subject, catalogNumber, 'undergraduate', term);
  let $ = null;

	// Get list of profs
	try {
		const html = await utils.getHTML(url);
		$ = cheerio.load(html);
	} catch (err) {
		console.log(err);
		return { err, classInfo: null };
	}

  // Get unis
  const units = Number($('tr').eq(1).find('td').eq(2).text().trim());

  // Get note
  let note = $('tr').eq(2).text().trim();
  // If no note, this would be the text of the table.  We don't want that.
  if (!note.startsWith("Note")) note = "";
  else note = note.replace(/Note(s)?:/, '').trim();

  // Get class info
  const table = $('table').eq(1);
  const rows = table.find('tr').slice(1);

  const classInfo = [];

  rows.each((i, row) => {
    const rowArr = $(row).find('td').map((i2, el) => $(el).text().trim()).get();
    if (rowArr[0].startsWith('Reserve') && classInfo.length > 0) {
      // Has reserve group
      Object.assign(classInfo[classInfo.length - 1], formatReserve(rowArr));
    } else if (rowArr[0].startsWith('Topic') && classInfo.length > 0) {
      // Has a topic
      const topic = rowArr[0].replace('Topic:', '').trim();
      classInfo[classInfo.length - 1].topic = topic;
      // If has class timings attached
      // length = 3 means that there is no instructor
      if (rowArr.length === 3 || rowArr.length === 4) {
        const timeObj = formatTimes(rowArr[1]);
        const location = rowArr[2].replace(/\s+/g, ' ');
        const instructor = formatInstructor(rowArr[3]);
        classInfo[classInfo.length - 1].classes.push({
          ...timeObj,
          location,
          instructor,
        });
      }
    } else if (rowArr[0].startsWith('Held') && classInfo.length > 0) {
      // Is held with a different course
      // NOTE: Currently, we don't care about this. We just want the class timing.
      if (rowArr.length === 3 || rowArr.length === 4) {
        const timeObj = formatTimes(rowArr[1]);
        const location = rowArr[2].replace(/\s+/g, ' ');
        const instructor = formatInstructor(rowArr[3]);
        classInfo[classInfo.length - 1].classes.push({
          ...timeObj,
          location,
          instructor,
        });
      }
    } else if (rowArr.length >= 12) {
      const metadata = { units, note, topic: '' };
      if (rowArr[10] == null) console.log(subject, catalogNumber);
      const rowObj = Object.assign(metadata, formatRow(rowArr));
      if (rowObj.section.length === 0 && classInfo.length > 0) {
        const { classes } = rowObj;
        classInfo[classInfo.length - 1].classes.push(classes[0]);
      } else classInfo.push(rowObj);
    } else {
      console.log(subject, catalogNumber, rowArr.join(' '));
    }
  });

  return { err: null, classInfo };
}

/****************************
 *													*
 *			H E L P E R S 			*
 *													*
 ****************************/

// Create adm.uwaterloo URL
const createURL = (subject, catalogNumber, level, term) => {
  level = (level.includes('under')) ? 'under' : 'grad';
  subject = subject.toUpperCase();
  catalogNumber = catalogNumber.toUpperCase();
  return `http://www.adm.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?level=${level}&sess=${term}&subject=${subject}&cournum=${catalogNumber}`;
}

// Format instructor into firstname lastname
const formatInstructor = (instructor) => {
  if (instructor == null) return '';
  const [lastName, firstName] = instructor.split(',');
  return `${firstName} ${lastName}`;
}

// Format time string into:
// {
//   startTime: '',
//   endTime: '',
//   weekdays: [],
//   isTBA: false,
//   isCancelled: false,
//   isClosed: false
// }
const formatTimes = (timeStr) => {
  const timeObj = {
    startTime: '',
    endTime: '',
    weekdays: [],
    dateRange: '',
    isTBA: false,
    isCancelled: false,
    isClosed: false,
  };
  if (timeStr === 'TBA') {
    timeObj.isTBA = true;
    return timeObj;
  }
  // TODO: This has not been verified.  Find a course that is closed and change
  // as appropriate.
  if (timeStr.toLowerCase().includes('cancelled')) {
    timeObj.isCancelled = true;
    return timeObj;
  }
  // TODO: This has not been verified.  Find a course that is closed and change
  // as appropriate.
  if (timeStr.toLowerCase().includes('closed')) {
    timeObj.isClosed = true;
    return timeObj;
  }

  // Parse times
  const matchArr = timeStr.match(/(\d+):(\d+)-(\d+):(\d+)([A-Z][A-Za-x]*)(\d\d\/\d\d-\d\d\/\d\d)?/);
  if (matchArr == null || matchArr.length < 6) return timeObj;

  let [
    startHour,
    startMin,
    endHour,
    endMin,
    dayStr,
    datesStr,
  ] = matchArr.slice(1);
  const RE_DAY = /(M)?(Th|T)?(W)?(Th)?(F)?/g;
	weekdays =  RE_DAY.exec(dayStr)
		.slice(1, 6)
		.map((d) => (d == null) ? null : d)
		.filter(d => d != null);

  if (datesStr != null) timeObj.dateRange = datesStr;


  // We need to check if the time is in AM or PM cuz the ADM time formatting sucks
  // A time is AM if start time is from 8 - 11
  startHour = Number(startHour);
  endHour = Number(endHour);
  const isAM = (startHour >= 8 && startHour < 12);
  if (!isAM) {
    if (startHour < 12) startHour += 12;
    if (endHour < 12) endHour += 12;
  }

  return Object.assign(timeObj, {
    startTime: `${startHour}:${startMin}`,
    endTime: `${endHour}:${endMin}`,
    weekdays,
  });
};

// Format reserve arr into useable object
const formatReserve = (reserveArr) => {
  const reserveGroup = reserveArr[0].split(': ')[1];
  const reserveCap = Number(reserveArr[1]);
  const reserveTotal = Number(reserveArr[2]);
  return { reserveGroup, reserveCap, reserveTotal };
};

// Format row data into useable object
const formatRow = (row) => ({
  classNumber: Number(row[0]),
  section: row[1],
  campus: row[2].replace(/\s+/g, ' '),
  // associatedClass: row[3],
  // relatedComp1: row[4],
  // relatedComp2: row[5],
  enrollmentCap: Number(row[6]),
  enrollmentTotal: Number(row[7]),
  waitingCap: Number(row[8]),
  waitingTotal: Number(row[9]),
  reserveCap: 0,
  reserveTotal: 0,
  reserveGroup: '',
  classes: [
    {
      ...formatTimes(row[10]),
      location: row[11].replace(/\s+/g, ' '),
      instructor: formatInstructor(row[12]),
    }
  ],
  lastUpdated: new Date(Date.now()).toLocaleDateString("en-US", {
      year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
  }),
});


module.exports = {
  getClassInfo,
};
