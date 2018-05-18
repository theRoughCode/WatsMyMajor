const admin = require('firebase-admin');

// Enable hiding of API Key
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://watsmymajor.firebaseio.com"
});

const coursesRef = admin.database().ref('/courses/');
const reqsRef = admin.database().ref('/reqs/');
const usersRef = admin.database().ref('/users/');

module.exports = {
	coursesRef,
  reqsRef,
  usersRef
};
