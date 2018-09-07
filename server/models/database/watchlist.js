const { watchlistRef } = require('./index');

// This table is used to manage the list of users who are watching classes.

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

// Adds a watcher to a class
function addWatcher(term, classNum, username) {
  return watchlistRef
    .child(`${term}/${classNum}/watchers/${username}`)
    .set(true);
}

// Removes a watcher from a class
function removeWatcher(term, classNum, username) {
  return watchlistRef
    .child(`${term}/${classNum}/watchers/${username}`)
    .remove();
}

// Sets last updated enrollment numbers
function setEnrollment(term, classNum, info) {
  return watchlistRef
    .child(`${term}/${classNum}/enrollment`)
    .set(info);
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Returns { watchers, err }
async function getWatchers(term, classNum) {
  try {
    const snapshot = await watchlistRef.child(`${term}/${classNum}/watchers`).once('value');
    const watchers = (snapshot.val() != null) ? Object.keys(snapshot.val()) : [];
    return { watchers, err: null };
  } catch (err) {
    console.log(err);
    return { watchers: null, err };
  }
}

// Returns { enrollment, err }
async function getEnrollment(term, classNum) {
  try {
    const snapshot = await watchlistRef.child(`${term}/${classNum}/enrollment`).once('value');
    const enrollment = snapshot.val();
    return { enrollment, err: null };
  } catch (err) {
    console.log(err);
    return { enrollment: null, err };
  }
}

module.exports = {
  addWatcher,
  removeWatcher,
  setEnrollment,
  getWatchers,
  getEnrollment,
};
