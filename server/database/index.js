const admin = require('firebase-admin');

// Enable hiding of API Key
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_URL
});

const classesRef = admin.database().ref('/classes/');
const courseListRef = admin.database().ref('/courseList/');
const courseRatingsRef = admin.database().ref('/courseRatings/');
const coursesRef = admin.database().ref('/courses/');
const emailsRef = admin.database().ref('/emails/');
const facebookUsersRef = admin.database().ref('/facebookUsers/');
const majorsRef = admin.database().ref('/majors/');
const profsRef = admin.database().ref('/profs/');
const reqsRef = admin.database().ref('/reqs/');
const reviewsRef = admin.database().ref('/reviews/');
const statsRef = admin.database().ref('/stats/');
const usersRef = admin.database().ref('/users/');
const watchlistRef = admin.database().ref('/watchlist/');
const profilePicBucket = admin.storage().bucket();

module.exports = {
  classesRef,
  courseListRef,
  courseRatingsRef,
  coursesRef,
  emailsRef,
  facebookUsersRef,
  majorsRef,
  profsRef,
  reqsRef,
  reviewsRef,
  statsRef,
  usersRef,
  watchlistRef,
  profilePicBucket,
};
