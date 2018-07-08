const requisites = require('./database/requisites');
const async = require('async');

const cached = {};

// Returns a prerequisites tree.
// If there are no prereqs: { subject, catalogNumber }
// Else, { subject, catalogNumber, choose, children }
function getPrereqsTree(subject, catalogNumber, callback) {
  if (cached.hasOwnProperty(subject + catalogNumber)) {
    const { choose, children } = cached[subject + catalogNumber];
    callback({ subject, catalogNumber, choose, children });
    return;
  }
  requisites.getPrereqs(subject, catalogNumber, (err, prereqs) => {
		if (err) {
			console.error(err);
      callback({ subject, catalogNumber });
		} else if (prereqs == null || !prereqs.hasOwnProperty('reqs')) {
      cached[subject + catalogNumber] = {};
      callback({ subject, catalogNumber });
    } else {
      parsePrereqs(prereqs, parsedReqs => {
        if (parsedReqs == null) {
          cached[subject + catalogNumber] = {};
          callback({ subject, catalogNumber });
        } else {
          const { choose, children } = parsedReqs;
          cached[subject + catalogNumber] = parsedReqs;
          callback({ subject, catalogNumber, choose, children });
        }
      });
		}
	});
}

function parsePrereqs(prereqs, callback) {
  if (prereqs == null || Object.keys(prereqs).length === 0) {
    callback(null);
    return;
  }

  if (prereqs.hasOwnProperty('choose')) {
    const { choose, reqs } = prereqs;
    async.map(reqs, (req, innerCallback) => {
      parsePrereqs(req, parsedReqs => innerCallback(null, parsedReqs));
    }, (_, reqTree) => {
      callback({ choose, children: reqTree });
    });
  } else if (prereqs.hasOwnProperty('subject')) {
    const { subject, catalogNumber } = prereqs;
    getPrereqsTree(subject, catalogNumber, tree => callback(tree));
  } else {
    callback(null);
  }
}


module.exports = {
  getPrereqsTree
};
