const { facebookUsersRef } = require('./index');

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

function setFacebookUser(facebookID, userId, callback) {
  facebookUsersRef
    .child(facebookID)
    .set(userId)
    .then(() => callback(null))
    .catch(err => callback(err));
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Returns username corresponding to facebook user
async function getFacebookUser(facebookID, callback) {
  try {
    const snapshot = await facebookUsersRef.child(facebookID).once('value');
    callback(null, snapshot.val());
  } catch (err) {
    callback(err, null);
  }
}

module.exports = {
  setFacebookUser,
  getFacebookUser,
};
