const { auth } = require('./index');

function createUser(username, email, password, displayName, callback) {
  auth().createUser({
    uid: username
    email,
    password,
    displayName,
  })
    .then(() => callback(null))
    .catch(err => callback(err));
}
