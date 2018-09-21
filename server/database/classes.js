const { classesRef } = require('./index');

/****************************
 *                          *
 *      S E T T E R S       *
 *                          *
 ****************************/

function setClasses(subject, catalogNumber, term, classes) {
  return classesRef
    .child(`${term}/${subject.toUpperCase()}/${catalogNumber}`)
    .set(classes);
}

/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

async function getClasses(subject, catalogNumber, term) {
  try {
    const snapshot = await classesRef
      .child(`${term}/${subject}/${catalogNumber}`)
      .once('value');
    const classes = await snapshot.val();
    return { err: null, classes };
  } catch (err) {
    console.error(err);
    return { err: err.message, classes: null };
  }
}

module.exports = {
  setClasses,
  getClasses,
};
