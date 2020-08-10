const requisites = require('../database/requisites');
const { getCourseTitle } = require('../database/courseList');

let cached = {};

// want to clear cache if too large
const MAX_LENGTH = 100;

// Returns a prerequisites tree.
// If there are no prereqs: { subject, catalogNumber, title }
// Else, { subject, catalogNumber, title, choose, children }
async function getPrereqsTree(subject, catalogNumber) {
  if (Object.keys(cached).length > MAX_LENGTH) cached = {};
  if (cached.hasOwnProperty(subject + catalogNumber)) {
    const { title, choose, children } = cached[subject + catalogNumber];
    return { subject, catalogNumber, title, choose, children };
  }

  let title = '';
  let { err, reqs } = await requisites.getPrereqs(subject, catalogNumber);
  if (err) {
    console.error(err);
    return { subject, catalogNumber, title };
  }
  ({ err, title } = await getCourseTitle(subject, catalogNumber));
  if (err) {
    console.error(err);
    return { subject, catalogNumber, title: '' };
  }

  if (reqs == null || !reqs.hasOwnProperty('reqs')) {
    cached[subject + catalogNumber] = { title };
    return { subject, catalogNumber, title };
  }

  const parsedReqs = await parsePrereqs(reqs);
  if (parsedReqs == null) {
    cached[subject + catalogNumber] = { title };
    return { subject, catalogNumber, title };
  } else {
    const { choose, children } = parsedReqs;
    cached[subject + catalogNumber] = parsedReqs;
    cached[subject + catalogNumber].title = title;
    return { subject, catalogNumber, title, choose, children };
  }
}

async function parsePrereqs(prereqs) {
  if (prereqs == null || Object.keys(prereqs).length === 0) {
    return null;
  }

  if (prereqs.hasOwnProperty('choose')) {
    const { choose, reqs } = prereqs;
    const reqTree = await Promise.all(reqs.map(parsePrereqs));
    return { choose, children: reqTree };
  } else if (prereqs.hasOwnProperty('subject')) {
    const { subject, catalogNumber } = prereqs;
    const tree = await getPrereqsTree(subject, catalogNumber);
    return tree;
  } else return null;
}

module.exports = {
  getPrereqsTree,
};
