const watApi = require('uwaterloo-api');
const fs = require('fs');
const async = require('async');
const database = require('../models/data');

// Enable hiding of API Key
require('dotenv').config();

const TERM = '1181';  // Winter 2017
const coreqExceptions = ['HLTH333'];

// instantiate client
const uwclient = new watApi({
	API_KEY : process.env.API_KEY
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
				last_updated
			};
		});

		const data = {
			term: TERM,
			classes
		}
		return callback(data);
	});
}

// Use API
function getReqInfo(subject, course_number, callback) {
	getDataReqs(subject, course_number, reqs =>
		uwclient.get(`/courses/${subject}/${course_number}.json`, function(err, res){
			 if(err) console.error(err);
			 let { title, description, crosslistings } = res.data;
			 var prereqs = reqs.prereqs || [];
			 var coreqs =  reqs.coreqs || [];
			 var antireqs = ((Array.isArray(reqs.antireqs))
												? reqs.antireqs
												: [reqs.antireqs]) || [];

			 crosslistings = (Array.isArray(crosslistings))
					? crosslistings
					: [crosslistings] || [];

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
				 prereqs,
				 antireqs,
				 coreqs,
				 crosslistings,
				 terms,
				 subject,
				 catalog_number: course_number,
				 url: res.data.url
			 }
			 callback(data);
		 })
	);
}

// handles Choose One event
function pick (arr) {
	var string = "";
	var num = arr[0];
	string += ("   Choose " + num + " of:<ul type='circle'>");
	arr.slice(1).forEach(elem => {
		if (typeof elem[0] === 'number'){
			num = elem[0];
			string += ("      Choose " + num + " of:<ul>");
			elem.slice(1).forEach(elem2 => string += `<li>${getLink(elem2)}</li>`);
		}
		else if (Array.isArray(elem)) {
			string += ("All of:<ul>");
			elem.forEach(elem2 => string += `<li>${getLink(elem2)}></li>`);
		}
		else string += `<li>${getLink(elem)}</li>`;
	});
	return string + "</ul>";
}

// Converts weird data formatting to pick format
function unpick(str) {
	str = str.replace(/\s*and\s*/g,',');

	if (str.includes('of')) {
		var num = str.slice(0, 3);
		switch(num) {
			case 'One':
				num = 1;
				break;
			case 'Two':
				num = 2;
				break;
			case 'All':
				num = null;
				break;
			default:
				return str;
		}
		const arr = str.slice(6,-1).replace(/\s+/g,'').replace('/', ',').split(',');
		arr.unshift(num);
		return arr;
	} else if (str.includes(' or')) { // ASSUMING ONLY ONE GROUP OF 'or'
		var open = str.indexOf('(');
		var close = str.indexOf(')');
		// replace 'or' with comma and split into array
		var arr = str.slice(open + 1, close).replace(/or/g,', ').replace(/\s/g, '').split(',');
		arr.unshift(1); // add 1 to front
		// Remove special chars
		var checkSpecial = new RegExp('[^A-z0-9,]|\s', 'g');
		arr = [arr];
		// remove 'arr' from original string and exclude commas before and after
		str = str.slice(0, (open !== -1) ? open - 1 : open).concat(str.slice(close + 2));
		arr.push(...str.replace(checkSpecial, '').split(','));
		return arr;
	} else return parseCourse(str);
}

function getLink(course) {
	if(!course) return ``;
	// check for courses
	var regCourse = /[A-Z]{2,5}\s*\d{3,4}[A-Z]*/g;
	course = course.replace(regCourse, match => {
		match = match.replace(/\s/g, '');  // remove white space
		var index = match.search(/[0-9]/);
		const subject = match.slice(0, index);
		const cat_num = match.slice(index);
		// check for non alpha-numeric chars (except spaces)
		var checkSpecial = new RegExp('[^A-z0-9] | ^\s', 'g');
		match = match.replace(checkSpecial, '');
		if (!subject || ! cat_num || checkSpecial.test(subject) || checkSpecial.test(cat_num)) {
			return `${match}`;
		} else {
			return `<a href='/wat/${subject}/${cat_num}'>${match}</a>`;
		}
	});
	return course;
}

// Separate subject and catalog number from course string
function parseCourse(courseStr) {
	const index = courseStr.search(/[0-9]/);
	const subject = courseStr.slice(0, index);
	const catalogNumber = courseStr.slice(index);
	return {
		subject,
		catalogNumber
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

function nestReqs(reqArr) {
	if (!reqArr) return null;

	const reqs = reqArr.slice(!isNaN(reqArr[0])).map(req => {
		if (Array.isArray(req)) return nestReqs(req);
		else return parseCourse(req);
	});
	return {
		choose: (!isNaN(reqArr[0])) ? Number(reqArr[0]) : 0,
		reqs
	};
}

// Gets prerequisites from UW-API
function getPrereqs (subject, course_number, callback) {
	uwclient.get(`/courses/${subject}/${course_number}/prerequisites.json`, function(err, res){
		 if(err) {
			 console.error(err);
			 return callback(err, null);
		 }
		 if (!res) {
			 console.log("Undefined prereqs");
			 return callback(1, null);
		 }
		 const prereqs = res.data.prerequisites_parsed;

	 callback(null, nestReqs(prereqs));
 })
}

//  Gets requisites from UW-API
// returns object with prereqs, coreqs, and antireqs
function getReqs(subject, course_number, callback) {
	getPrereqs(subject, course_number, (err, prereqs) => {
		if(err) return callback(err, null);
		// for courses that don't have prereqs
		if(prereqs === 'undefined' || !prereqs) prereqs = null;

		uwclient.get(`/courses/${subject}/${course_number}.json`, (err, res) => {
			if(err) return callback(err, null);
			var coreqs, antireqs;
			if ((coreqs = res.data.corequisites)) {
				// Edge case of "Oneof"
				if (!Array.isArray(coreqs) && !coreqExceptions.includes(subject + course_number)) coreqs = unpick(coreqs);
				// if coreqs is normal string
				if (!Array.isArray(coreqs)) coreqs = [coreqs];
				else {
					coreqs = parseReqs(coreqs);
				}
			}
			if ((antireqs = res.data.antirequisites)) {
				// check if contains valid courses and not a note
				if (antireqs.length <= 6 || antireqs.replace(/\D/g, '').length > 2) {
					// remove whitespace and split by comma
					antireqs = antireqs
						.replace(/\s+/g, '')
						.replace('/', ',')
						.split(',');

					antireqs = parseReqs(antireqs);
				}
			}

			return callback(null, {
				prereqs: prereqs,
				coreqs: coreqs,
				antireqs: antireqs
			});
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
							subject: subject,
							cat_num: key,
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
							subject: subject,
							cat_num: key,
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
	getReqInfo,
	getCourses,
	getPrereqs,
	getReqs,
	getDataReqs,
	getParentReqs
}
