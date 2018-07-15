const { majorsRef } = require('./index');

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

async function setMajorRequirements(name, url, data) {
  try {
    const childRef = majorsRef.child(name);
    await childRef.child('url').set(url);
    await childRef.child('data').set(data);
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

module.exports = {
  setMajorRequirements,
  getMajorRequirements
};
