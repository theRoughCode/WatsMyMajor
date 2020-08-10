const { reqsRef } = require('./index');

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

// Remove non-alphanumeric symbols from catalog number because UW API is bad
const removeAlphaNumeric = (course) => {
  if (course.hasOwnProperty('catalogNumber')) {
    course.catalogNumber = course.catalogNumber.replace(/[^a-z0-9+]+/gi, '');
  }
};

/****************************
 *                          *
 *      S E T T E R S       *
 *                          *
 ****************************/

function setPrereqs(subject, catalogNumber, prereqs) {
  if (prereqs.hasOwnProperty('reqs')) prereqs.reqs.map(removeAlphaNumeric);
  return reqsRef.child(`${subject}/${catalogNumber}/prereqs`).set(prereqs);
}

function setCoreqs(subject, catalogNumber, coreqs) {
  coreqs.map(removeAlphaNumeric);
  return reqsRef.child(`${subject}/${catalogNumber}/coreqs`).set(coreqs);
}

function setAntireqs(subject, catalogNumber, antireqs) {
  antireqs.map(removeAlphaNumeric);
  return reqsRef.child(`${subject}/${catalogNumber}/antireqs`).set(antireqs);
}

function setPostreq(subject, catalogNumber, postreq, choose, alternatives) {
  catalogNumber = catalogNumber.replace(/[^a-z0-9+]+/gi, '');
  return reqsRef
    .child(`${subject}/${catalogNumber}/postreqs/${postreq.subject}/${postreq.catalogNumber}`)
    .set({ choose, alternatives });
}

/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

// Used to retrieve all items in requisites table
async function getRequisitesSnapshot() {
  return reqsRef.once('value');
}

async function getReqType(subject, catalogNumber, reqType) {
  try {
    const snapshot = await reqsRef.child(`${subject}/${catalogNumber}/${reqType}`).once('value');
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
};
