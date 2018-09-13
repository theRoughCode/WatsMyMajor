const { majorsRef } = require('./index');

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

async function setMajorRequirements(key, value) {
  try {
    await majorsRef.child(key).set(value);
    return null;
  } catch (err) {
    return err;
  }
}

/****************************
  *													*
  *			G E T T E R S 			*
  *													*
  ****************************/

async function getMajorRequirements(name) {
  try {
    const snapshot = await majorsRef.child(name).once('value');
    const data = await snapshot.val();
    return { err: null, data };
  } catch (err) {
    return { err, data: null };
  }
}

async function getList() {
  try {
    const snapshot = await majorsRef.once('value');
    const val = snapshot.val();
    const list = Object.keys(val).map((key) => ({
      key,
      name: val[key].name
    }));
    return { err: null, list };
  } catch (err) {
    return { err, list: null };
  }
}

module.exports = {
  setMajorRequirements,
  getMajorRequirements,
  getList
};
