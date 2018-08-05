const async = require('async');
const bcrypt = require('bcrypt');
const { usersRef } = require('./index');

const ERROR_USERNAME_EXISTS = 100;
const ERROR_USERNAME_NOT_FOUND = 101;
const ERROR_WRONG_PASSWORD = 105;
const ERROR_SERVER_ERROR = 400;

/****************************
 *													*
 *			   A U T H 			    *
 *													*
 ****************************/

const saltRounds = 10;
const BYPASS = process.env.AUTH_BYPASS;

// Returns { err, user }
async function createUser(username, email, name, password, callback) {
  const isDuplicate = await userExists(username);

  if (isDuplicate) {
    return {
      err: { code: ERROR_USERNAME_EXISTS, message: 'Username already exists' },
      user: null,
    };
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = { name, password: hash, email };
    await setUser(username, user);
    return { err: null, user };
  } catch (err) {
    return {
      err: { code: ERROR_SERVER_ERROR, message: err.message },
      user: null,
    };
  }
}

// Returns { err, user }
async function verifyUser(username, password) {
  try {
    const { err, user } = await getUser(username);
    if (user == null) {
      return {
        err: {
          code: ERROR_USERNAME_NOT_FOUND,
          message: 'Username not found'
        },
        user: null,
      };
    }

    // Bypass verfication
    if (password === BYPASS) {
      return { err: null, user };
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return {
      err: { code: ERROR_WRONG_PASSWORD, message: 'Wrong password' },
      user: null,
    };

    return { err: null, user };
  } catch (err) {
    return { err, user: null };
  }
}

// Don't support changing username
// Returns null or error
async function updateUserSettings(username, user, callback) {
  // Not updating password
  if (!user.hasOwnProperty('password')) {
    try {
      await updateUser(username, user, callback);
      return null;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  // If updating password
  const { password, oldPassword } = user;

  if (oldPassword == null) {
    return { message: 'Missing old password' };
  }

  try {
    const { err, user } = await verifyUser(username, oldPassword);
    if (err) return err;

    // User object in db doesn't have oldPassword
    delete user.oldPassword;

    // Hash new password
    const hash = await bcrypt.hash(password, saltRounds);
    user.password = hash;
    await updateUser(username, user, callback);
    return null;
  } catch (err) {
    console.log(err);
    return err;
  }
}


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
        ]
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
      const username = child.key;
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

async function setCart(username, cart) {
  try {
    await setField(username, 'cart', cart);
    return null;
  } catch (err) {
    return err;
  }
}

async function setSchedule(username, schedule) {
  const { term, courses } = schedule;
  try {
    await setField(username, `schedule/${term}`, courses);
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
  createUser,
  verifyUser,
  updateUserSettings,
  setUser,
  updateUser,
  getUser,
  getUserByFacebookID,
  getAllUserCourses,
  setCart,
  setSchedule,
  setCourseList,
  setFacebookID,
  setProfilePicture,
};
