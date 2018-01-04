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


/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

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

function storePostReqs(choose, prereqs, postreq, prereq, index, callback) {
	// Nested Requisite
	if (prereq.hasOwnProperty('choose')) {
		const choose = prereq.choose;
		prereqs = prereq.reqs;

		async.forEachOf(prereqs, storePostReqs.bind(this, choose, prereqs, postreq), err => {
			if (err) callback(err);
			else callback();
		});
	} else {
		const { subject, catalogNumber } = prereq;
		const alternatives = prereqs.filter(req => req.subject !== subject || req.catalogNumber !== catalogNumber);

		reqsRef.child(`${subject}/${catalogNumber}/postreqs/${postreq.subject}/${postreq.catalogNumber}`).set({ choose, alternatives })
			.then(() => callback())
			.catch(err => callback(err));
	}
}

function updateCourseRequisite(subject, catalogNumber, callback) {
	waterloo.getReqs(subject, catalogNumber, (err, reqs) => {
		if (err) return callback(err)
		else {
			console.log(`\nUpdating: ${subject} ${catalogNumber}`);

			let { prereqs, coreqs, antireqs } = reqs;

			// No requisities
			if (prereqs.length + coreqs.length + antireqs.length === 0)
				return callback();

			// Store prereqs in database
			reqsRef.child(`${subject}/${catalogNumber}/prereqs`).set(prereqs)
				.catch(err => callback(err));

			// Store coreqs in database
			reqsRef.child(`${subject}/${catalogNumber}/coreqs`).set(coreqs)
				.catch(err => callback(err));

			// Store antireqs in database
			reqsRef.child(`${subject}/${catalogNumber}/antireqs`).set(antireqs)
				.catch(err => callback(err));


			// Store parent requisites in database
			if (!prereqs.length && !Object.keys(prereqs).length) return callback();

			const choose = prereqs.choose;
			prereqs = prereqs.reqs;

			if (prereqs.length > 0) {
				const postreq = { subject, catalogNumber };
				async.forEachOf(prereqs, storePostReqs.bind(this, choose, prereqs, postreq), err => {
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
					updateCourseRequisite(subject, catalogNumber, err => {
						if (err) {
							console.error(err);
							failedList.push({ subject, catalogNumber, err });
						}
						catNumCallback();
					});
				}, err => {
					if (err) subjectCallback(err);
					else subjectCallback(null);
				});
			}, err => {
				if (err) {
					console.log('\n\n\n\n', err);
					callback(err, null);
				} else {
					console.log('Done updating course requisites! :D');
					console.log(`There were a total of ${failedList.length} errors.`);
					callback(null, failedList);
				}
			});
		})
		.catch(err => callback(err, null));
}



/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

 function getReqType(subject, catalogNumber, reqType, callback) {
	 reqsRef
 		.child(`${subject}/${catalogNumber}/${reqType}`)
 		.once('value')
 		.then(snapshot => callback(null, snapshot.val()))
		.catch(err => callback(err, null));
 }

 function getPrereqs(subject, catalogNumber, callback) {
 	getReqType(subject, catalogNumber, 'prereqs', callback);
 }

 function getCoreqs(subject, catalogNumber, callback) {
 	getReqType(subject, catalogNumber, 'coreqs', callback);
 }

 function getAntireqs(subject, catalogNumber, callback) {
 	getReqType(subject, catalogNumber, 'antireqs', callback);
 }

 function getPostreqs(subject, catalogNumber, callback) {
 	getReqType(subject, catalogNumber, 'postreqs', callback);
 }

 function getRequisites(subject, catalogNumber, callback) {
 	getReqType(subject, catalogNumber, '', callback);
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
	getPrereqs,
	getCoreqs,
	getAntireqs,
	getPostreqs,
	getRequisites,
	getSearchResults
};
