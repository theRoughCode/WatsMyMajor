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

async function createUser(username, email, name, password, callback) {
  const isDuplicate = await userExists(username);

  if (isDuplicate) {
    callback({ code: ERROR_USERNAME_EXISTS, message: 'Username already exists' });
    return;
  }
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      callback({ code: ERROR_SERVER_ERROR, message: err.message });
      return;
    }
    setUser(username, {
      name,
      password: hash,
      email
    }, callback);
  });
}

function verifyUser(username, password, callback) {
  getUser(username, (err, user) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (user == null) {
      callback({ code: ERROR_USERNAME_NOT_FOUND, message: 'Username not found' }, null);
      return;
    }

    bcrypt.compare(password, user.password, function(err, res) {
      if (err) callback({ code: ERROR_SERVER_ERROR, message: err.message }, null);
      else if (!res) callback({ code: ERROR_WRONG_PASSWORD, message: 'Wrong password'}, null);
      else callback(null, user);
    });
  });
}

// Don't support changing username
// Returns null or error
function updateUserSettings(username, password, user, callback) {
  verifyUser(username, password, (err, _) => {
    if (password !== BYPASS && err) callback(err);
    else {
      const newPassword = user.newPassword;
      delete(user.username);
      delete(user.password);
      delete(user.newPassword);
      // If updating password
      if (newPassword != null) {
        bcrypt.hash(newPassword, saltRounds, function(err, hash) {
          if (err) {
            callback(err);
            return;
          }
          user.password = hash;
          updateUser(username, user, callback);
        });
      } else {
        updateUser(username, user, callback);
      }
    }
  });
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
//   cart: [],
//   schedule: [],
//   courseList: []
// }
function setUser(username, user, callback) {
  usersRef
    .child(username)
    .set(user)
    .then(() => callback(null))
    .catch(err => callback(err));
}

function updateUser(username, user, callback) {
  usersRef
    .child(username)
    .update(user)
    .then(() => callback(null))
    .catch(err => callback(err));
}

function setField(userId, field, data, callback) {
  usersRef
    .child(userId)
    .child(field)
    .set(data)
    .then(() => callback(null))
    .catch(err => callback(err));
}



/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

async function getUser(username, callback) {
  try {
    const snapshot = await usersRef.child(username).once('value');
    callback(null, snapshot.val());
  } catch (err) {
    callback(err, null)
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

function setCart(username, cart, callback) {
  setField(username, 'cart', cart, callback);
}

function setSchedule(username, schedule, callback) {
  const { term, courses } = schedule;
  setField(username, `schedule/${term}`, courses, callback);
}

function setCourseList(username, courseList, callback) {
  setField(username, 'courseList', courseList, callback);
}

module.exports = {
  createUser,
  verifyUser,
  updateUserSettings,
  setUser,
  updateUser,
  getUser,
  getAllUserCourses,
  setCart,
  setSchedule,
  setCourseList,
};
