const usersDB = require('../database/users');

function getUser(username) {
  return usersDB.getUser(username);
}

module.exports = {
  getUser,
};
