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

function setPostReq(subject, catalogNumber, postreq, optional) {
	console.log(subject + catalogNumber);
	return reqsRef.child(`${subject}/${catalogNumber}/postreqs/${postreq.subject}/${postreq.catalogNumber}/optional`).set(optional);
}

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

function storePostReqs(optional, postreq, prereq, index, callback) {
	const { subject, catalogNumber } = prereq;

	// Is a nested requisite
	if (!subject && !catalogNumber) {
		const { choose, reqs } = prereq;

		async.forEachOf(reqs, storePostReqs.bind(this, optional, postreq), err => {
			if (err) callback(err);
			else callback();
		});
	} else {
		setPostReq(subject, catalogNumber, postreq, optional)
		.then(() => callback())
		.catch(err => callback(err));
	}
}

function updateCourseRequisite(subject, catalogNumber, callback) {
	waterloo.getReqs(subject, catalogNumber, (err, reqs) => {
		if (err) {
			failedList.push({ subject, catalogNumber, err });
			callback();
		}	else {
			console.log(`\nCourse: ${subject} ${catalogNumber}`);

			// Store requisites in database
			reqsRef.child(`${subject}/${catalogNumber}`).set(reqs)
				.catch(err => callback(err));

			// Store parent requisites in database
			let { prereqs } = reqs;
			if (!prereqs) return callback();

			const choose = prereqs.choose;
			const optional = choose !== null && choose > 0;
			prereqs = prereqs.reqs;

			if (prereqs.length > 0) {
				const postreq = { subject, catalogNumber };
				async.forEachOf(prereqs, storePostReqs.bind(this, optional, postreq), err => {
					if (err) callback(err);
					else callback();
				});
			} else return callback();
		}
	});
}

function updateRequisites(callback) {
	coursesRef.once('value')
		.then(snapshot => {
			const courseList =  snapshot.val();
			const failedList = [];

			async.forEachOfLimit(courseList, 10, (course, subject, subjectCallback) => {
				async.forEachOfLimit(course, 10, (title, catalogNumber, catNumCallback) => {
					if (!title) return catNumCallback();

					// Get course reqs
					updateCourseRequisite(subject, catalogNumber, catNumCallback);
				}, err => {
					if (err) subjectCallback(err);
					else subjectCallback(null);
				});
			}, err => {
				if (err) {
					console.log('\n\n\n\n', err);
					callback(err, null);
				} else {
					callback(null, failedList);
				}
			});
		})
		.catch(err => callback(err, null));
}

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
	updateCourseRequisite,
	updateRequisites,
	updateCourseList,
	getSearchResults
};
