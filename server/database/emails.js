const { emailsRef } = require('./index');

/*
 *  This keeps track of the emails in use
 *
 */


/****************************
  *													*
  *			S E T T E R S 			*
  *													*
  ****************************/

function setEmail(username, email) {
  email = email.replace(/\./g, ',');
  return emailsRef
    .child(email)
    .set(username);
}

function deleteEmail(email) {
  email = email.replace(/\./g, ',');
  return emailsRef.child(email).remove();
}


/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Returns true if an email exists
async function emailExists(email) {
  email = email.replace(/\./g, ',');
  const snapshot = await emailsRef.once('value');
  const exists = snapshot.hasChild(email);
  return exists;
}

module.exports = {
  setEmail,
  deleteEmail,
  emailExists,
};
