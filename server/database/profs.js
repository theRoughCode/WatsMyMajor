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
    const snapshot = await profsRef
      .child(profName.replace(/(\s|\.)/g, ''))
      .once('value');
    const prof = await snapshot.val();
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
      profList.push(childSnapshot.child('name').val());
    });
    return { err: null, profList };
  } catch (err) {
    console.error(err);
    return { err: err.message, profList: null };
  }
}

module.exports = {
  setProfClasses,
  setRMP,
  getProf,
  getProfList,
};
