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

// Updates course list
function updateCourseList(callback) {
	waterloo.getCourses((err, data) => {
		if (err) return callback(err);
		const dataObj = data.reduce((acc, courseData) => {
			const { subject, catalog_number, title } = courseData;
			if (!acc.hasOwnProperty(subject)) acc[subject] = {};
			acc[subject][catalog_number] = title;
			return acc;
		}, {});

		coursesRef.set(dataObj)
			.then(() => callback(null))
			.catch(err => callback(err));
	});
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
				const title = courses[subject][catalogNumber];
				coursesForSearch.push({ subject, catalogNumber, title });
			});
		});
		return { err: null, courses: coursesForSearch };
	} catch (err) {
		console.log(err);
		return { err, courses: null };
	}
}


/****************************
 *													*
 *			   M I S C 			    *
 *													*
 ****************************/

// Extractors for fuzzy searching
const simpleExtractor = ({ subject, catalogNumber }) => subject + catalogNumber;
const titleExtractor = ({ subject, catalogNumber, title }) => subject + catalogNumber + title;

// Searches courses with query and a specified number of results to return
async function searchCourses(query, limit) {
	try {
		const { err, courses } = await getCoursesForSearch();
		if (err) return { err, result: null };

		// If query length is <= 5, only search by subject and catalogNumber.
		// Else include title in search as well.
		const extract = (query.length <= 5) ? simpleExtractor : titleExtractor;
		const matches = fuzzy.filter(query, coursesForSearch, { extract }).slice(0, limit);

		// If using simple extractor and not enough to populate results, use title extractor.
		if (query.length <= 5 && matches.length < limit) {
			const matches2 = fuzzy.filter(query, coursesForSearch, { extract: titleExtractor }).slice(0, limit - matches.length);
			matches.push(...matches2);
		}
		const result = matches.map(({ original }) => original);
		return { err: null, result };
	} catch (err) {
		console.log(err);
		return { err, result: null };
	}
}

module.exports = {
  updateCourseList,
  searchCourses
};
