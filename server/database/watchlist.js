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

// Sets subject
function setSubject(term, classNum, subject) {
  return watchlistRef
    .child(`${term}/${classNum}/subject`)
    .set(subject.toUpperCase());
}

// Sets catalog number
function setCatalogNumber(term, classNum, catalogNumber) {
  return watchlistRef
    .child(`${term}/${classNum}/catalogNumber`)
    .set(catalogNumber);
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
    console.error(err);
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
    console.error(err);
    return { enrollment: null, err };
  }
}

// Returns { subject, catalogNumber, err }
async function getSubjectAndCatNum(term, classNum) {
  try {
    const subjectSnapshot = await watchlistRef.child(`${term}/${classNum}/subject`).once('value');
    const catalogNumberSnapshot = await watchlistRef.child(`${term}/${classNum}/catalogNumber`).once('value');
    const subject = subjectSnapshot.val();
    const catalogNumber = catalogNumberSnapshot.val();
    return { subject, catalogNumber, err: null };
  } catch (err) {
    console.error(err);
    return { subject: null, catalogNumber: null, err };
  }
}

module.exports = {
  addWatcher,
  removeWatcher,
  setEnrollment,
  setSubject,
  setCatalogNumber,
  getWatchers,
  getEnrollment,
  getSubjectAndCatNum,
};
