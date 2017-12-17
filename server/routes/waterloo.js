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

			 var terms = res.data.terms_termsOffered;

			 if (!terms) {
				 const string = 'Offered: ';
				 const startIndex = description.indexOf(string);
				 const endIndex = description.indexOf(']', startIndex + string.length);
				 if (startIndex < endIndex) {
					 terms = description.slice(startIndex + string.length, endIndex).split(',');
					 description = description.substring(0, startIndex - 1);
				 } else terms = [];
			 }

			 //OUTPUT STRING
			 const prereqsString = [];
			 // Prerequisites
			 if(prereqs && prereqs[0] === 1) {
				 let temp = [prereqs[0]];
				 prereqs.slice(1).forEach(elem => {
					 if(Array.isArray(elem)) temp = temp.concat(elem.slice(1));
					 else temp = temp.concat(elem);
				 });
				 prereqs = temp;
			 }
			 if(Array.isArray(prereqs)){
				 // if first elem is a digit
				 if(!isNaN(prereqs[0])) prereqsString.push(pick(prereqs));
				 else {
					 prereqs.forEach(prereq => {
						 if (typeof prereq[0] == 'number') prereqsString.push(pick(prereq));
						 else prereqsString.push(`${getLink(prereq)}`);
					 });
				 }
			 } else prereqsString.push(`${getLink(prereqs)}`);

			 // Corequisites
			 const coreqsString = [];
			 // Prerequisites
			 if(coreqs && coreqs[0] === 1) {
				 let temp = [coreqs[0]];
				 coreqs.slice(1).forEach(elem => {
					 if(Array.isArray(elem)) temp = temp.concat(elem.slice(1));
					 else temp = temp.concat(elem);
				 });
				 coreqs = temp;
			 }
			 if(Array.isArray(coreqs)){
				 // if first elem is a digit
				 if(!isNaN(coreqs[0])) coreqsString.push(pick(coreqs));
				 else {
					 coreqs.forEach(coreq => {
						 if (typeof coreq[0] == 'number') coreqsString.push(pick(coreq));
						 else coreqsString.push(`${getLink(coreq)}`);
					 });
				 }
			 } else coreqsString.push(`${getLink(coreqs)}`);

			 const data = {
				 title,
				 description,
				 prereqs,
				 antireqs,
				 coreqs,
				 crosslistings,
				 terms,
				 string: {
					 prereqs: prereqsString,
					 coreqs: coreqsString
				 },
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
		str = str.slice(6,-1).replace(/\s+/g,'').replace('/', ',').split(',');
		str.unshift(num);
		return str;
	} else if (str.includes(' or')) { // ASSUMING ONLY ONE GROUP OF 'or'
		var open = str.indexOf('(');
		var close = str.indexOf(')');
		// replace 'or' with comma and split into array
		var fixed = str.slice(open + 1, close).replace(/or/g,', ').replace(/\s/g, '').split(',');
		fixed.unshift(1); // add 1 to front
		// Remove special chars
		var checkSpecial = new RegExp('[^A-z0-9,]|\s', 'g');
		fixed = [fixed];
		// remove 'fixed' from original string and exclude commas before and after
		str = str.slice(0, (open > 0) ? open - 1 : open).concat(str.slice(close + 2));
		fixed.push(...str.replace(checkSpecial, '').split(','));
		return fixed;
	} else return str;
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

	 callback(null, prereqs);
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
					coreqs.forEach((coreq, index) => {
						if (typeof coreq === 'string') {
							coreq = unpick(coreq);
							// add course subject for those without
							if (index > 0 && !isNaN(coreq.charAt(0))) {
								var prev = coreqs[index - 1];
								if (Array.isArray(prev)) prev = prev[prev.length - 1];  // get last elem
								if(typeof prev === 'string')
									coreq = prev.replace(/[0-9]/g, '') + coreq;
							}
							coreqs[index] = coreq;
						}
					});
				}
			}
			if ((antireqs = res.data.antirequisites)) {
				// remove whitespace and split by comma
				antireqs = antireqs.replace(/\s+/g, '').split(',');
				// add course subject for those without
				antireqs.forEach((antireq, index) => {
					if(!isNaN(antireq.charAt(0)) && index > 0)
						antireqs[index] = antireqs[index - 1].match(/[A-Z]{3,5}/) + antireq;
				});
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
		if (err) console.error(err);
		callback(res);
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
