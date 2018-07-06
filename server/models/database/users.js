const async = require('async');
const { usersRef } = require('./index');

/* A list of the courses available
    {
      userId: {
        name,
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
//   pass: '',
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
  setUser,
  setCart,
  setSchedule,
  setCourseList,
  getUser
};
