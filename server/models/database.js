const admin = require('firebase-admin');
const waterloo = require('./waterloo');
const async = require('async');
const utils = require('./utils');

const serviceAccount = JSON.parse(process.env.FIREBASE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://watsmymajor.firebaseio.com"
});

const coursesRef = admin.database().ref('/courses/');
const reqsRef = admin.database().ref('/reqs/');


// function updateRequisites(subject, catalogNumber, callback) {
// 	waterloo.getReqs(subject, catalogNumber, (err, reqs) => {
// 		if (err) callback(err);
//
// 		reqsRef.child(`${subject}/${catalogNumber}`).set(reqs)
// 			.then(() => callback(null))
// 			.catch(err => callback(err));
// 	});
// }

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
	})
}

function updateRequisites(callback) {
	coursesRef.once('value')
		.then(snapshot => {
			const courseList =  snapshot.val();
			const failedList = [];

			async.mapValuesLimit(courseList, 10, (course, subject, subjectCallback) => {
				async.mapValuesLimit(course, 10, (title, catalogNumber, catNumCallback) => {
					if (!title) return catNumCallback(null, null);

					waterloo.getReqs(subject, catalogNumber, (err, reqs) => {
						if (err) {
							failedList.push({ subject, catalogNumber, err });
							catNumCallback(null, null);
						}	else {
							console.log(`\nCourse: ${subject} ${catalogNumber}`);
							reqsRef.child(`${subject}/${catalogNumber}`).set(reqs)
								.catch(err => catNumCallback(err, null));
							catNumCallback(null, reqs);
						}
					});
				}, (err, result) => {
					if (err) subjectCallback(err, null);
					else subjectCallback(null, result);
				});
			}, (err, result) => {
				if (err) {
					console.log('\n\n\n\n', err);
					callback(err, null);
				} else {
					reqsRef.set(result);
					callback(null, failedList);
				}
			});
		})
		.catch(err => callback(err, null));
}

// Get course search results given query string and max number of results
function getSearchResults(query, num, callback) {
	const { subject, catalogNumber } = utils.parseCourse(query);
	console.log(subject);
	console.log(catalogNumber);

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
					String(key).includes(String(catalogNumber))
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
	updateRequisites,
	updateCourseList,
	getSearchResults
};
