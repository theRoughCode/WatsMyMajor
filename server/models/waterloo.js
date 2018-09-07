const watApi = require('uwaterloo-api');
const utils = require('./utils');

/*
	This file is used to interact with the UW API and is mainly used for
	populating Firebase.
*/

// Enable hiding of API Key
require('dotenv').config();

const TERM = '1189';  // Fall 2018
const coreqExceptions = ['HLTH333'];

// instantiate client
const uwclient = new watApi({
	API_KEY : process.env.WATERLOO_API_KEY
});

function getInstructor(instructor) {
	if (!instructor || !instructor.length) return '';
	return instructor.split(',').reverse().join(' ');
}

// Extract weekdays from courses
function parseWeekdays(weekdays) {
	const RE_DAY = /(M)?(Th|T)?(W)?(Th)?(F)?/g;
	return RE_DAY.exec(weekdays)
		.slice(1, 6)
		.map((d) => (d == null) ? null : d)
		.filter(d => d != null);
}

// Retrieves terms
// Returns { currentTerm, previousTerm, nextTerm }
// TODO: Remove hard coded term with this
function getTerms(callback) {
	uwclient.get('/terms/list.json', function(err, res) {
		if(err) return callback({ currentTerm: null, previousTerm: null, nextTerm: null });
		const { current_term, previous_term, next_term } = res.data;
		return callback({
			currentTerm: current_term,
			previousTerm: previous_term,
			nextTerm: next_term
		});
	});
}

// Retrieves specific information on classes
// TODO: Move to firebase
function getCourseClasses(subject, catalogNumber) {
	return new Promise((resolve, reject) => {
		uwclient.get(`/terms/${TERM}/${subject}/${catalogNumber}/schedule.json`, function(err, res) {
			if (err || res.data.length === 0) {
				if (err) console.log(err);
				return resolve(null);
			}

			const classes = res.data.map(course => {
				const {
					units,
					note,
					class_number,
					section,
					campus,
					enrollment_capacity,
					enrollment_total,
					waiting_capacity,
					waiting_total,
					reserves,
					classes,
					last_updated
				} = course;

				const lastUpdated = new Date(last_updated);
				const options = {
				    year: "numeric", month: "short",
				    day: "numeric", hour: "2-digit", minute: "2-digit"
				};

				const {
					date,
					location,
					instructors
				} = classes[0];

				const {
					start_time,
					end_time,
					weekdays,
					is_tba,
					is_cancelled,
					is_closed
				} = date;

				const { building, room } = location;

				const reserveObj = reserves[0];
				let reserve_capacity = 0;
				let reserve_total = 0;
				let reserve_group = '';
				if (reserveObj != null) {
					reserve_capacity = reserveObj.enrollment_capacity;
					reserve_total = reserveObj.enrollment_total;
					reserve_group = reserveObj.reserve_group;
				}

				return {
					units,
					note: note || '',
					classNumber: class_number,
					section,
					campus,
					enrollmentCap: enrollment_capacity,
					enrollmentTotal: enrollment_total,
					waitingCap: waiting_capacity,
					waitingTotal: waiting_total,
					reserveCap: reserve_capacity,
					reserveTotal: reserve_total,
					reserveGroup: reserve_group,
					startTime: start_time,
					endTime: end_time,
					weekdays: parseWeekdays(weekdays),
					isTBA: is_tba,
					isCancelled: is_cancelled,
					isClosed: is_closed,
					instructor: getInstructor(instructors[0]),
					location: (building || room) ? `${building} ${room}` : 'TBA',
					lastUpdated: lastUpdated.toLocaleDateString("en-US", options)
				};
			});

			resolve({
				term: TERM,
				classes
			});
		});
	});
}

// Gets prerequisites from UW-API
// { prereqString, prereqs }
// TODO: Need to scrape.  UW API sucks
function getPrereqs(subject, catalogNumber, callback) {
	uwclient.get(`/courses/${subject}/${catalogNumber}/prerequisites.json`, function(err, res){
		if (err) {
			console.error(err);
			return callback(err, null);
		}
		if (!res) {
			console.error("Undefined prereqs");
			return callback(1, null);
		}

		if (!Object.keys(res.data).length) return callback(null, {
			prereqString: '',
			prereqs: {}
		});

		const prereqString = res.data.prerequisites.replace('Prereq:', '').trim();
		const prereqs = res.data.prerequisites_parsed;

		callback(null, {
			prereqString,
			prereqs: utils.nestReqs(prereqs)
		});
 })
}

// Gets description of course
function getCourseDescription(subject, catalogNumber, callback) {
	uwclient.get(`/courses/${subject}/${catalogNumber}.json`, function(err, res) {
		if (err) {
			console.error(err);
			return callback(err, null);
		}
		if (!Object.keys(res.data).length) 	return callback('No course found.', null);
		const { title, description } = res.data;
		callback(null, { subject, catalogNumber, title, description });
	});
}

// Gets course information from UW API
// returns { err, info }
function getCourseInformation(subject, catalogNumber) {
	return new Promise((resolve, reject) => {
		uwclient.get(`/courses/${subject}/${catalogNumber}.json`, function(err, res) {
			if (err) {
				console.error(err);
				return resolve({ err, info: null });
			}
			if (!Object.keys(res.data).length) 	return resolve({ err: 'No course found.', info: null });
			const {
				title,
				units,
				description,
				crosslistings,
				terms_offered,
				notes,
				url,
				academic_level,
				// offerings,
				// needs_department_consent,
				// needs_instructor_consent,
				// extra,
				// calendar_year,
			} = res.data;

			const info = {
				title,
				units,
				description,
				crosslistings,
				terms: terms_offered,
				notes,
				url,
				academicLevel: academic_level,
			};
			resolve({ err: null, info });
		});
	});
}

//  Gets requisites from UW-API
// returns object with prereqs, coreqs, and antireqs
function getReqs(subject, catalogNumber, callback) {
	getPrereqs(subject, catalogNumber, (err, prereqData) => {
		if(err) return callback(err, null);

		let { prereqString, prereqs } = prereqData;

		uwclient.get(`/courses/${subject}/${catalogNumber}.json`, (err, res) => {
			if (err) {
				console.error(err);
				return callback(err, null);
			}
			if (!Object.keys(res.data).length)	return callback('No course found.', null);

			let { title, description, crosslistings } = res.data;
			const coreqString = res.data.corequisites || '';
			const antireqString = res.data.antirequisites || '';
			let coreqs = coreqString;
			let antireqs = antireqString;

			if (coreqs) {
				// Edge case of "Oneof"
				if (!Array.isArray(coreqs) && !coreqExceptions.includes(subject + catalogNumber))
					coreqs = coreqs.replace('Coreq:', '');
					coreqs = utils.unpick(coreqs);

				if (coreqs.hasOwnProperty('choose')) {
					coreqs.reqs = utils.parseReqs(coreqs.reqs);
				}

				if (Array.isArray(coreqs)) {
					coreqs = utils.parseReqs(coreqs);
				} else {
					coreqs = [coreqs];
				}
			} else coreqs = [];

			if (antireqs) {
				// check if contains valid courses and not a note
				if (!(/[a-z]/.test(antireqString))) {
					// remove whitespace and split by comma
					antireqs = antireqs
						.replace(/\s+/g, '')
						.replace('/', ',')
						.split(',');

					antireqs = utils.parseReqs(antireqs);
				} else antireqs = [antireqString];
			} else antireqs = [];

			crosslistings = (!crosslistings)
				? []
				: (Array.isArray(crosslistings))
					? crosslistings
					: [crosslistings];

			var terms = res.data.terms_offered;

			if (!terms) {
				const string = 'Offered: ';
				const startIndex = description.indexOf(string);
				const endIndex = description.indexOf(']', startIndex + string.length);
				if (startIndex < endIndex) {
					terms = description.slice(startIndex + string.length, endIndex).split(',');
					description = description.substring(0, startIndex - 1);
				} else terms = [];
			}

			const data = {
				title,
				description,
				prereqString,
				coreqString,
				antireqString,
				prereqs,
				antireqs,
				coreqs,
				crosslistings,
				terms,
				subject,
				catalogNumber,
				url: res.data.url
			}
			callback(null, data);
		});
	});
}

// Gets courses from UW-API
function getCourses(callback) {
	uwclient.get('/courses.json', function (err, res) {
		if (err) return callback(err, null);
		else return callback(null, res.data);
	})
}

// Exports
module.exports = {
	getTerms,
	getCourseClasses,
	getCourseInformation,
	getCourseDescription,
	getReqs,
	getCourses,
}
