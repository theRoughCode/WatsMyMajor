const fs = require('fs');
const COURSE_LIST = './server/data/course_list.json';
const DATA = './server/data/data.json';

/*
  PERFORM OPERATIONS ON JSON
*/

// gets JSON from file
function getJSON(filepath, callback) {
  fs.readFile(filepath, 'utf8', (err, data) => {
    if(err) {
      console.error(err);
      callback(err, null)
    }
    callback(null, JSON.parse(data));
  });
}

// filter JSON
function filter(json, pred_arr, callback) {
  if (!Array.isArray(pred_arr) || pred_arr.length === 0) return callback(null);

  const result = new Array(pred_arr.length);

  const keys = Object.keys(json);
  var keysLeft = keys.length;

  if (keysLeft === 0) return callback(null);

  keys.forEach(key => {
    if(json.hasOwnProperty(key)) {
      for (var i = 0; i < pred_arr.length; i++) {
        if(pred_arr[i](json[key])) {
          if(typeof result[i] !== 'object') result[i] = {};
          result[i][key] = json[key];
        }
      }
    }
    if (--keysLeft === 0) return callback(result);
  });
}

// retrieve course data
function getCourseData(subject, cat_num, callback) {
  getJSON(DATA, (err, json) => {
    if(err) callback(null);

    return callback((json && json[subject] && json[subject][cat_num]) ? json[subject][cat_num] : null);
  });
}

// write to JSON
function writeToFile(file, json, callback) {
  fs.writeFile(file, json, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
}

module.exports = {
  COURSE_LIST,
  DATA,
  getJSON,
  filter,
  writeToFile,
  getCourseData
}
