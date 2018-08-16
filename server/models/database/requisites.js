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

function setPrereqs(subject, catalogNumber, prereqs) {
	return reqsRef.child(`${subject}/${catalogNumber}/prereqs`).set(prereqs);
}

function setCoreqs(subject, catalogNumber, coreqs) {
	return reqsRef.child(`${subject}/${catalogNumber}/coreqs`).set(coreqs);
}

function setAntireqs(subject, catalogNumber, antireqs) {
	return reqsRef.child(`${subject}/${catalogNumber}/antireqs`).set(antireqs);
}

function setPostreq(subject, catalogNumber, postreq, choose, alternatives) {
	return reqsRef
		.child(`${subject}/${catalogNumber}/postreqs/${postreq.subject}/${postreq.catalogNumber}`)
		.set({ choose, alternatives });
	// return reqsRef.child(`${subject}/${catalogNumber}/postreqs`).set(postreqs);
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Used to retrieve all items in requisites table
async function getRequisitesSnapshot() {
	return await reqsRef.once('value');
}

async function getReqType(subject, catalogNumber, reqType) {
	try {
		const snapshot = await reqsRef
	 		.child(`${subject}/${catalogNumber}/${reqType}`)
	 		.once('value');
		const reqs = await snapshot.val();
		return { err: null, reqs };
	} catch (err) {
		return { err, reqs: null };
	}
}

function getPrereqs(subject, catalogNumber) {
	return getReqType(subject, catalogNumber, 'prereqs');
}

function getCoreqs(subject, catalogNumber) {
	return getReqType(subject, catalogNumber, 'coreqs');
}

function getAntireqs(subject, catalogNumber) {
	return getReqType(subject, catalogNumber, 'antireqs');
}

function getPostreqs(subject, catalogNumber) {
	return getReqType(subject, catalogNumber, 'postreqs');
}

function getRequisites(subject, catalogNumber) {
	return getReqType(subject, catalogNumber, '');
}

module.exports = {
	setPrereqs,
	setCoreqs,
	setAntireqs,
	setPostreq,
	getRequisitesSnapshot,
	getPrereqs,
	getCoreqs,
	getAntireqs,
	getPostreqs,
	getRequisites,
}
