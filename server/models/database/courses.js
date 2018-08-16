const async = require('async');
const fuzzy = require('fuzzy');
const { coursesRef } = require('./index');
const waterloo = require('../waterloo');
const utils = require('../utils');

const coursesForSearch = [];

/* A list of the courses available
    {
      subject: {
        catalogNumber: title
      }
    }
*/

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

function setCourses(courses) {
	return coursesRef.set(courses);
}

function setCourseInfo(subject, catalogNumber, info) {
	return coursesRef.child(`${subject}/${catalogNumber}`).set(info);
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Retrieves all courses as strings to be used for search
async function getCoursesForSearch() {
	// Get cached courses if cached
	if (coursesForSearch.length > 0) return { err: null, courses: coursesForSearch };

	try {
		const snapshot = await coursesRef.once('value');
		const courses = snapshot.val();
		const subjects = Object.keys(courses);
		subjects.forEach(subject => {
			const catalogNumbers = Object.keys(courses[subject]);
			catalogNumbers.forEach(catalogNumber => {
				const { title } = courses[subject][catalogNumber];
				coursesForSearch.push({ subject, catalogNumber, title });
			});
		});
		return { err: null, courses: coursesForSearch };
	} catch (err) {
		console.log(err);
		return { err, courses: null };
	}
}

// Returns course information
// { err, course }
async function getCourse(subject, catalogNumber) {
	try {
		const snapshot = await coursesRef
	 		.child(`${subject}/${catalogNumber}`)
	 		.once('value');
		const course = await snapshot.val();
		return { err: null, course };
	} catch (err) {
		console.log(err);
		return { err: err.message, course: null };
	}
}


/****************************
 *													*
 *			   M I S C 			    *
 *													*
 ****************************/

// Extractors for fuzzy searching
const simpleExtractor = ({ subject, catalogNumber }) => subject + ' ' + catalogNumber;
const titleExtractor = ({ subject, catalogNumber, title }) => subject + ' ' + catalogNumber + ' - ' + title;

// Returns true if array contains course
const containsCourse = ({ subject, catalogNumber }, arr) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].subject === subject && arr[i].catalogNumber === catalogNumber) return true;
	}
	return false;
}

// Searches courses with query and a specified number of results to return
async function searchCourses(query, limit) {
	try {
		const { err, courses } = await getCoursesForSearch();
		if (err) return { err, result: null };

		// If query length is <= 5, only search by subject and catalogNumber.
		// Else include title in search as well.
		const extract = (query.length <= 5) ? simpleExtractor : titleExtractor;
		const result = [];
		let fuzzyResults = fuzzy.filter(query, courses, { extract });
		for (let i = 0; i < fuzzyResults.length; i++) {
			if (result.length >= limit) break;
			const course = fuzzyResults[i].original;
			if (!containsCourse(course, result)) result.push(course);
		}
		// If using simple extractor and not enough to populate results, use title extractor.
		if (query.length <= 5 && result.length < limit) {
			fuzzyResults = fuzzy.filter(query, courses, { extract: titleExtractor });
			for (let i = 0; i < fuzzyResults.length; i++) {
				if (result.length >= limit) break;
				const course = fuzzyResults[i].original;
				if (!containsCourse(course, result)) result.push(course);
			}
		}
		return { err: null, result };
	} catch (err) {
		console.log(err);
		return { err, result: null };
	}
}

module.exports = {
  setCourses,
	setCourseInfo,
  searchCourses,
	getCourse,
};
