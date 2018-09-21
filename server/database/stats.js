const { statsRef } = require('./index');

/* A list of the courses available
    {
      subject: {
        catalogNumber: title
      }
    }
*/

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

// Update most popular courses
async function updateMostPopular(courses) {
  try {
    statsRef.child('popular').set(courses);
  } catch (err) {
    return { err };
  }
  return { err: null };
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/


// Get most popular courses
async function getMostPopular(limit) {
  try {
    const snapshot = await statsRef
      .child('popular')
      .orderByValue()
      .limitToLast(limit)
      .once('value');
    const results = snapshot.val();
    return { err: null, results };
  } catch (err) {
    return { err, results: [] };
  }
}

module.exports = {
  updateMostPopular,
  getMostPopular,
};
