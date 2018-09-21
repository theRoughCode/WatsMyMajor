const bcrypt = require('bcryptjs');
const { usersRef } = require('./index');
const emails = require('./emails');

const ERROR_USERNAME_EXISTS = 100;
const ERROR_USERNAME_NOT_FOUND = 101;
const ERROR_WRONG_PASSWORD = 105;
const ERROR_USER_NOT_VERIFIED = 107;
const ERROR_EMAIL_EXISTS = 200;
const ERROR_SERVER_ERROR = 400;

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
  // Ensure that passwords aren't being set here (would be plaintext).
  // Should use updateUserSettings
  if (Object.hasOwnProperty('password')) delete user.password;
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

async function getUserByFacebookID(facebookId, callback) {
  try {
    const snapshot = await usersRef
      .orderByChild('facebookID')
      .equalTo(facebookId)
      .once('value');
    callback(null, snapshot.val());
  } catch (err) {
    callback(err, null);
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
    return { err, courseCount: [] };
  }
}

async function userExists(username) {
  const snapshot = await usersRef.child(username).once('value');
  return snapshot.exists();
}


/****************************
 *													*
 *			   M I S C 			    *
 *													*
 ****************************/



async function setVerified(username, isVerified) {
  try {
    await setField(username, 'verified', isVerified);
    return null;
  } catch (err) {
    return err;
  }
}

async function setCart(username, cart) {
  try {
    await setField(username, 'cart', cart);
    return null;
  } catch (err) {
    return err;
  }
}

async function setSchedule(username, schedule) {
  try {
    await setField(username, 'schedule', schedule);
    return null;
  } catch (err) {
    return err;
  }
}

async function setCourseList(username, courseList) {
  try {
    await setField(username, 'courseList', courseList);
    return null;
  } catch (err) {
    return err;
  }
}

async function addToWatchlist(username, term, classNum) {
  try {
    await setField(username, `watchlist/${term}/${classNum}`, true);
    return null;
  } catch (err) {
    return err;
  }
}

async function removeFromWatchlist(username, term, classNum) {
  try {
    await setField(username, `watchlist/${term}/${classNum}`, null);
    return null;
  } catch (err) {
    return err;
  }
}

async function setFacebookID(username, facebookID) {
  try {
    await setField(username, 'facebookID', facebookID);
    return null;
  } catch (err) {
    return err;
  }
}

async function setProfilePicture(username, url) {
  try {
    await setField(username, 'profileURL', url);
    return null;
  } catch (err) {
    return err;
  }
}

module.exports = {
  setUser,
  updateUser,
  deleteUser,
  getUser,
  getUserByFacebookID,
  getAllUserCourses,
  userExists,
  setVerified,
  setCart,
  setSchedule,
  setCourseList,
  addToWatchlist,
  removeFromWatchlist,
  setFacebookID,
  setProfilePicture,
};
