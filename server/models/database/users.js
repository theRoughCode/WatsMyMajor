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

const defaultUser = {
  name: '',
  cart: [],
  schedule: [],
  courseList: []
}

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

function setUser(userId, user, callback) {
  usersRef
    .child(userId)
    .set(Object.assign(defaultUser, user))
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

function getUser(userId, callback) {
  usersRef
    .child(userId)
		.once('value')
    .then(snapshot => callback(null, snapshot.val()))
    .catch(err => callback(err, null));
}


/****************************
 *													*
 *			   M I S C 			    *
 *													*
 ****************************/

function setCart(userId, cart, callback) {
  setField(userId, 'cart', cart, callback);
}

function setSchedule(userId, schedule, callback) {
  setField(userId, 'schedule', schedule, callback);
}

function setCourseList(userId, courseList, callback) {
  setField(userId, 'courseList', courseList, callback);
}

module.exports = {
  setUser,
  setCart,
  setSchedule,
  setCourseList,
  getUser
};
