const async = require('async');
const { coursesRef } = require('./index');
const waterloo = require('../waterloo');
const utils = require('../utils');

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


// Get course search results given query string and max number of results
function getSearchResults(query, num, callback) {
 	const { subject, catalogNumber } = utils.parseCourse(query);

 	if (!num || isNaN(num)) num = 5;

 	coursesRef
 		.orderByKey()
 		.startAt(subject)
 		// .endAt(`${subject}\uf8ff`)
 		.limitToFirst(1)
 		.once('value')
 		.then(snapshot => {
 			const matches = snapshot.val();
 			const matchSubject = Object.keys(matches)[0];
 			const filteredMatches = Object.keys(matches[matchSubject])
 				.filter(key =>
 					!catalogNumber ||
 					String(key).toLowerCase().includes(String(catalogNumber).toLowerCase())
 				)
 				.reduce((matchArr, matchCatNum) => {
 					if (matchArr.length >= num) return matchArr;

 					matchArr.push({
 						subject: matchSubject,
 						catalogNumber: matchCatNum,
 						title: matches[matchSubject][matchCatNum]
 					});
 					return matchArr;
 				}, []);

 			callback(null, filteredMatches);
 		})
 		.catch(err => {
 			console.error(err);
 			callback(err);
 		});
 }

module.exports = {
  updateCourseList,
  getSearchResults
};
