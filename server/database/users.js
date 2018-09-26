const { usersRef } = require('./index');

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

async function userExists(username) {
  const snapshot = await usersRef.child(username).once('value');
  return snapshot.exists();
}

async function getNumUsers() {
  const snapshot = await usersRef.once('value');
  return snapshot.numChildren();
}


module.exports = {
  setUser,
  updateUser,
  deleteUser,
  setField,
  getUser,
  getAllUserCourses,
  userExists,
  getNumUsers,
};
