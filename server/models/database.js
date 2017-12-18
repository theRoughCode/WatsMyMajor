const admin = require('firebase-admin');
const waterloo = require('./waterloo');
const async = require('async');

const {
	type,
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri,
  token_uri,
  auth_provider_x509_cert_url,
  client_x509_cert_url
} = process.env;

const serviceAccount = {
	type,
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri,
  token_uri,
  auth_provider_x509_cert_url,
  client_x509_cert_url
};

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

module.exports = {
	updateRequisites,
	updateCourseList
};
