const { usersRef } = require('./index');
const { emailsRef } = require('./index');

/* A list of the courses available
    {
      username: {
        cart: [],
        schedule: [{
          term,
          courses
        }],
        courseList: [
          term,
          courses
        ],
        schedule: {
          term: [
            {
              subject,
              catalogNumber,
              classes: {}
            }
          ]
        }
      }
    }
*/

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

// username: {
//   name: '',
//   email: '',
//   password: '',
//   facebookID: '',
//   profileURL: '',
//   isSchedulePublic: bool,
//   cart: [],
//   schedule: [],
//   courseList: []
// }
function setUser(username, user) {
  return usersRef
    .child(username)
    .set(user);
}

function updateUser(username, user) {
  return usersRef
    .child(username)
    .update(user);
}

function deleteUser(username) {
  return usersRef
    .child(username)
    .remove();
}

function setField(userId, field, data) {
  return usersRef
    .child(userId)
    .child(field)
    .set(data);
}



/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

// Returns { user, err }
async function getUser(username) {
  try {
    const snapshot = await usersRef.child(username).once('value');
    return { user: snapshot.val(), err: null };
  } catch (err) {
    return { user: null, err };
  }
}

async function getUserByEmail(email) {
  try {
    // TODO: get this to work in a single query... so we can get rid of the emailsRef
    const emailSnapshot = await emailsRef.child(email).once('value');
    const username = emailSnapshot.val();
    const snapshot = await usersRef.child(username).once('value');
    return { user: { ... snapshot.val(), username }, err: null };
  } catch (err) {
    return { user: null, err };
  }
}

async function getUserByResetToken(token) {
  try {
    const snapshot = await usersRef.orderByChild('resetPasswordToken').equalTo(token).once('value');
    const snapshotVal = snapshot.val();
    if (!snapshotVal) { return { user: null, err: "Token does not exist" }; }
    const username = Object.keys(snapshotVal)[0];
    const user = { ...snapshotVal[username], username };
    return { user, err: null };
  } catch (err) {
    return { user: null, err };
  }
}

async function getAllUserCourses() {
  try {
    const snapshot = await usersRef.once('value');
    const courseCount = {};
    snapshot.forEach(child => {
      const { courseList } = child.val();
      if (courseList == null || courseList.length === 0) return;
      courseList.forEach(({ courses }) => {
        if (courses == null || courses.length === 0) return;
        courses.forEach(({ subject, catalogNumber }) => {
          if (!subject) return;
          const key = `${subject}-${catalogNumber}`;
          if (!courseCount.hasOwnProperty(key)) courseCount[key] = 1;
          else courseCount[key]++;
        });
      });
    });
    return { err: null, courseCount };
  } catch (err) {
    return { err, courseCount: {} };
  }
}

// Returns { schedule, name, err }
async function getUserSchedule(username) {
  try {
    const privacySnapshot = await usersRef.child(`${username}/isSchedulePublic`).once('value');
    // Not public
    if (privacySnapshot.exists() && !privacySnapshot.val()) {
      return { schedule: null, name: null, err: null };
    }
    const scheduleSnapshot = await usersRef.child(`${username}/schedule`).once('value');
    if (!scheduleSnapshot.exists()) return { schedule: null, name: null, err: null };
    const nameSnapshot = await usersRef.child(`${username}/name`).once('value');
    return { schedule: scheduleSnapshot.val(), name: nameSnapshot.val(), err: null };
  } catch (err) {
    return { schedule: null, name: null, err };
  }
}

async function userExists(username) {
  const snapshot = await usersRef.child(username).once('value');
  return snapshot.exists();
}

async function getNumUsers() {
  const snapshot = await usersRef.once('value');
  return snapshot.numChildren();
}

async function getUnverifiedUsers() {
  const snapshot = await usersRef.orderByChild('verified').equalTo(false).once('value');
  return snapshot.val();
}


module.exports = {
  setUser,
  updateUser,
  deleteUser,
  setField,
  getUser,
  getUserByEmail,
  getUserByResetToken,
  getAllUserCourses,
  getUserSchedule,
  userExists,
  getNumUsers,
  getUnverifiedUsers,
};
