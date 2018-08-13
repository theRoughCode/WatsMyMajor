const { getPrereqs } = require('./database/requisites');
const async = require('async');

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
	if (index === -1) return {
		subject: courseStr.toUpperCase(),
		catalogNumber: ''
	};

	const subject = courseStr.slice(0, index).toUpperCase();
	const catalogNumber = courseStr.slice(index);

	return {
		subject,
		catalogNumber,
		title
	};
}

// Nests "choose" requisites
function nestReqs(reqArr) {
	if (!Array.isArray(reqArr)) return {};

	const reqs = reqArr.slice(!isNaN(reqArr[0])).map(req => {
		if (Array.isArray(req)) {
			// [1, 'CS136']
			if (!isNaN(req[0]) && req.slice(1).length === 1) return parseCourse(req[1]);
			else return nestReqs(req);
		} else return parseCourse(req);
	});
	return {
		choose: (!isNaN(reqArr[0])) ? Number(reqArr[0]) : 0,
		reqs
	};
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
				if (Array.isArray(prev)) prev = prev[prev.length - 1];  // get last elem
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
			return{ subject: reqStrArr[0], catalogNumber: reqStrArr[1] };
		}
	});
}

// Converts weird data formatting to pick format
function unpick(str) {
	str = str.replace(/\s*and\s*/g,',');

	if (str.includes('of')) {
		var choose = str.slice(0, 3);
		switch(choose) {
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
		const arr = str.slice(6,-1).replace(/\s+/g,'').replace('/', ',').split(',');
		return { choose, reqs: arr };
	} else if (str.includes(' or')) { // ASSUMING ONLY ONE GROUP OF 'or'
		const open = str.indexOf('(');
		const close = str.indexOf(')');
		// replace 'or' with comma and split into array
		const chooseReqs = str.slice(open + 1, close).replace(/or/g,', ').replace(/\s/g, '').split(',');
		const arr = [{
			choose: 1,
			reqs: fillInSubject(chooseReqs)
		}];
		// Remove special chars
		const checkSpecial = new RegExp('[^A-z0-9,]|\s', 'g');
		// remove 'arr' from original string and exclude commas before and after
		str = str.replace(/ *\([^)]*\) */g, "");
		const reqsArr = str.replace(checkSpecial, '').split(',').filter(r => r.length > 0);
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
		return [].concat.apply([], prereqs.reqs.map(req => flattenPrereqs(req)));
	}

	console.error('Unknown format', prereqs);
	return [];
}

function setCoursesPrereqs(courses, callback) {
	async.map(courses, (course, innerCallback) => {
		const { subject, catalogNumber } = course;
		if (course.prereqs != null) {
			innerCallback(null, course);
		} else {
			getPrereqs(subject, catalogNumber, (err, prereqs) => {
				if (err) {
					console.error(err);
					innerCallback(null, course);
				} else {
					prereqs = flattenPrereqs(prereqs);
					innerCallback(null, { subject, catalogNumber, prereqs });
				}
			});
		}
	}, (_, courses) => {
		callback(courses);
	});
}

// Used when updating user's courselist/cart
// We want to flatten the prereqs of each course and attach them to the course
// to be used as a course card.
function setCourseListPrereqs(courseList, callback) {
	async.map(courseList, (termCourses, outerCallback) => {
		const { courses } = termCourses;
		setCoursesPrereqs(courses, courses => outerCallback(null, termCourses));
	}, (_, termCourses) => callback(termCourses));
}


module.exports = {
	parseCourse,
	nestReqs,
	parseReqs,
	unpick,
	setCoursesPrereqs,
	setCourseListPrereqs
};
