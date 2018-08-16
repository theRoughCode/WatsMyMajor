const requisites = require('./database/requisites');

const cached = {};

// Returns a prerequisites tree.
// If there are no prereqs: { subject, catalogNumber }
// Else, { subject, catalogNumber, choose, children }
async function getPrereqsTree(subject, catalogNumber) {
  if (cached.hasOwnProperty(subject + catalogNumber)) {
    const { choose, children } = cached[subject + catalogNumber];
    return { subject, catalogNumber, choose, children };
  }

  const { err, reqs } = await requisites.getPrereqs(subject, catalogNumber);
  if (err) {
    console.error(err);
    return { subject, catalogNumber };
  }

  if (reqs == null || !reqs.hasOwnProperty('reqs')) {
    cached[subject + catalogNumber] = {};
    return { subject, catalogNumber };
  }

  const parsedReqs = await parsePrereqs(reqs);
  if (parsedReqs == null) {
    cached[subject + catalogNumber] = {};
    return { subject, catalogNumber };
  } else {
    const { choose, children } = parsedReqs;
    cached[subject + catalogNumber] = parsedReqs;
    return { subject, catalogNumber, choose, children };
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
  getPrereqsTree
};
