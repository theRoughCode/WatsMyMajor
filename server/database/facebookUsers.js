const { facebookUsersRef } = require('./index');

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

function setFacebookUser(facebookID, userId) {
  return facebookUsersRef
    .child(facebookID)
    .set(userId)
}

async function removeFacebookUser(facebookID) {
  try {
    await facebookUsersRef.child(facebookID).remove();
  } catch(err) {
    console.error(err)
    return err;
  }
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Returns username corresponding to facebook user
async function getFacebookUser(facebookID) {
  try {
    const snapshot = await facebookUsersRef.child(facebookID).once('value');
    if (!snapshot.exists()) return { err: null, user: null };
    return { err: null, user: snapshot.val() };
  } catch (err) {
    console.error(err);
    return { err, user: null };
  }
}

module.exports = {
  setFacebookUser,
  removeFacebookUser,
  getFacebookUser,
};
