const { profsRef } = require('./index');

/*
{
  name,
  courses: {
    subject: { catalogNumber: { term: true } }
  },
  rating,
  difficulty,
  tags,
  rmpUrl,
}
*/

/****************************
 *                          *
 *      S E T T E R S       *
 *                          *
 ****************************/

// Sets classes for prof
async function setProfClasses(prof, subject, catalogNumber, term) {
  const profRef = profsRef.child(`${prof.replace(/(\s|\.)/g, '')}`);
  try {
    await profRef.child('name').set(prof);
    await profRef
      .child(`courses/${subject.toUpperCase()}/${catalogNumber}/${term}`)
      .set(true);
    return null;
  } catch (err) {
    return err;
  }
}

function setRMP(prof, rmpURL, tags) {
  const profRef = profsRef.child(prof.replace(/(\s|\.)/g, ''));
  return profRef.update({ rmpURL, tags });
}

/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

async function getProf(profName) {
  try {
    const profId = profName.replace(/(\s|\.)/g, '');
    const snapshot = await profsRef
      .child(profId)
      .once('value');
    const prof = await snapshot.val();
    prof.id = profId;
    return { err: null, prof };
  } catch (err) {
    console.error(err);
    return { err: err.message, prof: null };
  }
}

async function getProfList() {
  try {
    const snapshot = await profsRef.once('value');
    const profList = [];
    snapshot.forEach(childSnapshot => {
      const name = childSnapshot.child('name').val();
      const id = childSnapshot.key;
      profList.push({ name, id });
    });
    return { err: null, profList };
  } catch (err) {
    console.error(err);
    return { err: err.message, profList: null };
  }
}

// Get list of profs for a course
async function getCourseProfs(subject, catalogNumber) {
  try {
    const snapshot = await profsRef.once('value');
    const profList = [];
    snapshot.forEach(childSnapshot => {
      const name = childSnapshot.child('name').val();
      const courses = childSnapshot.child('courses').val();
      if (courses == null) return;
      if (courses.hasOwnProperty(subject) && courses[subject].hasOwnProperty(catalogNumber)) {
        profList.push(name);
      }
    });
    return { err: null, profList };
  } catch (err) {
    console.error(err);
    return { err: err.message, profList: null };
  }
}

// Get prof id by name
async function getProfId(name) {
  try {
    const snapshot = await profsRef
      .orderByChild('name')
      .equalTo(name)
      .once('value');
    const prof = Object.keys(snapshot.val())[0];
    return { err: null, prof };
  } catch (err) {
    console.error(err);
    return { err: err.message, prof: null };
  }
}

module.exports = {
  setProfClasses,
  setRMP,
  getProf,
  getProfList,
  getCourseProfs,
  getProfId,
};
