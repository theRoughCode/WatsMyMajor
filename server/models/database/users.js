const async = require('async');
const bcrypt = require('bcrypt');
const { usersRef } = require('./index');

/****************************
 *													*
 *			   A U T H 			    *
 *													*
 ****************************/

const saltRounds = 10;
const BYPASS = process.env.AUTH_BYPASS;

function createUser(username, email, name, password, callback) {
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      callback(err);
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
      callback('User not found', null);
      return;
    }

    bcrypt.compare(password, user.password, function(err, res) {
      if (err) callback(err, null);
      else if (!res) callback('Wrong password', null);
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
    .child(`${userId}/${field}`)
    .set(data)
    .then(() => callback(null))
    .catch(err => callback(err));
}



/****************************
 *													*
 *			G E T T E R S 			*
 *													*
 ****************************/

function getUser(username, callback) {
  usersRef
    .child(username)
		.once('value')
    .then(snapshot => callback(null, snapshot.val()))
    .catch(err => callback(err, null));
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
  setField(username, 'schedule', schedule, callback);
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
  setCart,
  setSchedule,
  setCourseList,
  getUser
};
