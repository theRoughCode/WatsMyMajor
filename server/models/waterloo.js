const watApi = require('uwaterloo-api');
const fs = require('fs');
const async = require('async');
const database = require('./data');
const utils = require('./utils');

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

function getCourseInfo(subject, cat_num, callback) {
	uwclient.get(`/terms/${TERM}/${subject}/${cat_num}/schedule.json`, function(err, res) {
		if(err) return callback(null);
		if (res.data.length === 0) return callback(null);

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

			var lastUpdated = new Date(last_updated);
			var options = {
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

			return {
				units,
				note,
				class_number,
				section,
				campus,
				enrollment_capacity,
				enrollment_total,
				waiting_capacity,
				waiting_total,
				reserve_capacity: reserves.enrollment_capacity,
				reserve_total: reserves.enrollment_total,
				start_time,
				end_time,
				weekdays,
				is_tba,
				is_cancelled,
				is_closed,
				instructor: getInstructor(instructors[0]),
				location: (building || room) ? `${building} ${room}` : 'TBA',
				last_updated: lastUpdated.toLocaleDateString("en-US", options)
			};
		});

		const data = {
			term: TERM,
			classes
		}
		return callback(data);
	});
}

// Gets prerequisites from UW-API
// { prereqString, prereqs }
function getPrereqs(subject, course_number, callback) {
	uwclient.get(`/courses/${subject}/${course_number}/prerequisites.json`, function(err, res){
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

//  Gets requisites from UW-API
// returns object with prereqs, coreqs, and antireqs
function getReqs(subject, course_number, callback) {
	getPrereqs(subject, course_number, (err, prereqData) => {
		if(err) return callback(err, null);

		let { prereqString, prereqs } = prereqData;

		uwclient.get(`/courses/${subject}/${course_number}.json`, (err, res) => {
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
				if (!Array.isArray(coreqs) && !coreqExceptions.includes(subject + course_number)) coreqs = utils.unpick(coreqs);

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
				catalogNumber: course_number,
				url: res.data.url
			}
			callback(null, data);
		});
	});
}

// Gets courses from UW-API
function getCourses (callback) {
	uwclient.get('/courses.json', function (err, res) {
		if (err) return callback(err, null);
		else return callback(null, res.data);
	})
}


// --------------------- DATA FROM JSON ----------------------------

function getDataReqs(subject, cat_num, callback) {
	database.getJSON(database.DATA, (err, json) => {
		if(err) return callback(null);
		callback(json[subject][cat_num]);
	});
}

// returns [{courses that requires this as prereq}, {courses that requires
//    this as coreq}]
function getParentReqs(subject, cat_num, callback) {
	database.getJSON(database.DATA, (err, json) => {
		if(err) return callback(null);

		const course = subject + cat_num;
		const filtered = [[], []];
		const keys = Object.keys(json);
		var keysLeft = keys.length;

		if (keysLeft === 0) return callback(null);
		keys.forEach(subject => {
			database.filter(json[subject], [
				val => {
					if(!val.prereqs) return false;

					var prereqs = val.prereqs;

					if (Array.isArray(val.prereqs)){
						var chooseOne = (!isNaN(prereqs[0]) || typeof prereqs[0] === 'number');  // true if choose one
						prereqs.forEach((elem, index) => {
							// choose 1
							if (Array.isArray(elem)) {
								prereqs[index] = elem.join();
								// if course is among choose 1
								if(prereqs[index].includes(course)){
									val.prereqs["optional"] = true;
									return true;
								}
							} else if(elem === course) {  // Mandatory prereq
								if(chooseOne) {
									const regStr = eval(`/${elem.slice(0, -2)}[0-9]${elem.slice(-1)}/i`);

									// > -1 if advanced course is available
									var alt_index = prereqs.indexOf(regStr);
									prereqs.forEach(req => {
										if(req !== elem && regStr.test(req)) {
											val.prereqs["alternate"] = prereqs[index + 1];
											val.prereqs["optional"] = false;
										}
									});
									if (!val.prereqs["alternate"]) val.prereqs["optional"] = true;
								}
								return true;
							}
						});
						prereqs = prereqs.join();
					}
					if(val.prereqs['optional']) return true;

					if(prereqs.includes(course)) {
						val.prereqs["optional"] = false;
						return true;
					} else return false;
				},
				val => {
					if(!val.coreqs) return false;

					var coreqs = val.coreqs;
					if (Array.isArray(val.coreqs)){
						coreqs.forEach((elem, index) => {
							// choose 1
							if (Array.isArray(elem)) {
								coreqs[index] = elem.join();
								// if course is among choose 1
								if(coreqs[index].includes(course)){
									val.coreqs["optional"] = true;
									return true;
								}
							}
							if(typeof elem === 'string' && elem.includes(course)) {  // Mandatory coreq
								// optional if only course is specified
								val.coreqs["optional"] = (elem.includes('or'));
								return true;
							}
						});
						coreqs = coreqs.join();
					}
					if(val.coreqs['optional']) return true;

					if(coreqs.includes(course)) {
						val.coreqs["optional"] = false;
						return true;
					} else return false;
			}], sub_list => {
				// has this course as prereq
				if(sub_list[0]) {
					const courses = Object.keys(sub_list[0]);
					courses.forEach(key => {
						filtered[0].push({
							subject,
							catalogNumber: key,
							optional: sub_list[0][key]['prereqs']['optional'],
							alternate: sub_list[0][key]['prereqs']['alternate'] || null
						});
					});
				}
				// has this course as coreq
				if(sub_list[1]) {
					const courses = Object.keys(sub_list[1]);
					courses.forEach(key => {
						filtered[1].push({
							subject,
							catalogNumber: key,
							optional: sub_list[1][key]['coreqs']['optional']
						});
					});
				}
			})
			if (--keysLeft === 0) return callback(filtered);
		});
	});
}

// Exports
module.exports = {
	getCourseInfo,
	getCourseDescription,
	getCourses,
	getReqs,
	getDataReqs,
	getParentReqs
}
