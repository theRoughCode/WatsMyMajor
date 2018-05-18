const async = require('async');
const { reqsRef, coursesRef } = require('./index');
const waterloo = require('../waterloo');

/* A list of the course requisites
    {
      subject: {
        catalogNumber: {
          antireqs: [{ subject, catalogNumber }]
          prereqs: [{ subject, catalogNumber }]
          coreqs: [{ subject, catalogNumber }]
          postreqs: [{ subject, catalogNumber }]
        }
      }
    }
*/


/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

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


/****************************
 *													*
 *			   M I S C 			    *
 *													*
 ****************************/

// Set postreqs
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

// Get courses from courseList and calls `updateCourseRequisite`
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


module.exports = {
  updateCourseRequisite,
	updateRequisites,
	getPrereqs,
	getCoreqs,
	getAntireqs,
	getPostreqs,
	getRequisites,
}
