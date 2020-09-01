const WatApi = require('uwaterloo-api');
const utils = require('./utils');

/*
  This file is used to interact with the UW API and is mainly used for
  populating Firebase.
*/

// Enable hiding of API Key
require('dotenv').config();

const coreqExceptions = ['HLTH333'];

// instantiate client
const uwclient = process.env.TESTING
  ? null
  : new WatApi({
    API_KEY: process.env.WATERLOO_API_KEY,
  });

// Retrieves terms
// Returns { currentTerm, previousTerm, nextTerm }
// TODO: Remove hard coded term with this
function getTerms(callback) {
  uwclient.get('/terms/list.json', function (err, res) {
    if (err) return callback({ currentTerm: null, previousTerm: null, nextTerm: null });
    const currentTerm = res.data.current_term;
    const previousTerm = res.data.previous_term;
    const nextTerm = res.data.next_term;
    return callback({
      currentTerm,
      previousTerm,
      nextTerm,
    });
  });
}

// Gets prerequisites from UW-API
// Promise({ err, prereqString, prereqs })
// TODO: Need to scrape.  UW API sucks
function getPrereqs(subject, catalogNumber) {
  const data = { err: null, prereqString: '', prereqs: {} };
  return new Promise((resolve, reject) => {
    uwclient.get(`/courses/${subject}/${catalogNumber}/prerequisites.json`, function (err, res) {
      if (err) {
        console.error(err);
        data.err = err;
        return resolve(data);
      }
      if (!res) {
        console.error('Undefined prereqs');
        data.err = err;
        return resolve(data);
      }

      if (!Object.keys(res.data).length) return resolve(data);

      const prereqString = res.data.prerequisites.replace('Prereq:', '').trim();
      let prereqs = res.data.prerequisites_parsed;

      try {
        prereqs = utils.nestReqs(prereqs);
      } catch (err) {
        data.err = err;
        resolve(data);
      }

      resolve({
        err: null,
        prereqString,
        prereqs,
      });
    });
  });
}

// Gets description of course
function getCourseDescription(subject, catalogNumber, callback) {
  uwclient.get(`/courses/${subject}/${catalogNumber}.json`, function (err, res) {
    if (err) {
      console.error(err);
      return callback(err, null);
    }
    if (!Object.keys(res.data).length) return callback('No course found.', null);
    const { title, description } = res.data;
    callback(null, { subject, catalogNumber, title, description });
  });
}

// Gets course information from UW API
// returns { err, info }
function getCourseInformation(subject, catalogNumber) {
  return new Promise((resolve, reject) => {
    uwclient.get(`/courses/${subject}/${catalogNumber}.json`, function (err, res) {
      if (err) {
        console.error(err);
        return resolve({ err, info: null });
      }
      if (!Object.keys(res.data).length) return resolve({ err: 'No course found.', info: null });
      const {
        title,
        units,
        description,
        crosslistings,
        // eslint-disable-next-line camelcase
        terms_offered,
        notes,
        url,
        // eslint-disable-next-line camelcase
        academic_level,
        // offerings,
        // needs_department_consent,
        // needs_instructor_consent,
        // extra,
        // calendar_year,
      } = res.data;

      const info = {
        title,
        units,
        description,
        crosslistings,
        terms: terms_offered,
        notes,
        url,
        academicLevel: academic_level,
      };
      resolve({ err: null, info });
    });
  });
}

//  Gets requisites from UW-API
// returns object with prereqs, coreqs, and antireqs
function getReqs(subject, catalogNumber, callback) {
  getPrereqs(subject, catalogNumber).then(({ err, prereqString, prereqs }) => {
    if (err) return callback(err, null);

    uwclient.get(`/courses/${subject}/${catalogNumber}.json`, (err, res) => {
      if (err) {
        console.error(err);
        return callback(err, null);
      }
      if (!Object.keys(res.data).length) return callback('No course found.', null);

      let { title, description, crosslistings } = res.data;
      const coreqString = res.data.corequisites || '';
      const antireqString = res.data.antirequisites || '';
      let coreqs = coreqString;
      let antireqs = antireqString;

      if (coreqs) {
        try {
          // Edge case of "One of" or "or"
          if (!Array.isArray(coreqs) && !coreqExceptions.includes(subject + catalogNumber)) {
            coreqs = coreqs.replace('Coreq:', '');
          }

          if (coreqs.endsWith('only')) coreqs = [];
          else coreqs = utils.unpick(coreqs);

          if (coreqs.hasOwnProperty('choose')) {
            coreqs.reqs = utils.parseReqs(coreqs.reqs);
          }

          if (Array.isArray(coreqs)) {
            coreqs = utils.parseReqs(coreqs);
          } else {
            coreqs = [coreqs];
          }
        } catch (err) {
          callback(err, null);
        }
      } else coreqs = [];

      if (antireqs) {
        // check if contains valid courses and not a note
        if (!/[a-z]/.test(antireqString)) {
          antireqs = antireqs
            // SOC/LS 280 -> SOC 280,LS 280
            // NOTE:  only works for 2 options, need to modify to handle multiple
            .replace(/(\w+)\/(\w+) (\w+)/g, '$1 $3,$2 $3')
            .replace(/\//g, ',')
            // remove whitespace
            .replace(/\s+/g, '')
            // split by comma
            .split(',');

          try {
            antireqs = utils.parseReqs(antireqs);
          } catch (err) {
            callback(err, null);
          }
        } else antireqs = [antireqString];
      } else antireqs = [];

      crosslistings = !crosslistings
        ? []
        : Array.isArray(crosslistings)
          ? crosslistings
          : [crosslistings];

      var terms = res.data.terms_offered;

      if (!terms) {
        const string = 'Offered: ';
        const startIndex = description.indexOf(string);
        const endIndex = description.indexOf(']', startIndex + string.length);
        if (startIndex < endIndex) {
          terms = description.slice(startIndex + string.length, endIndex).split(',');
          description = description.substring(0, startIndex - 1);
        } else terms = [];
      }

      const data = {
        title,
        description,
        prereqString,
        coreqString,
        antireqString,
        prereqs,
        antireqs,
        coreqs,
        crosslistings,
        terms,
        subject,
        catalogNumber,
        url: res.data.url,
      };
      callback(null, data);
    });
  });
}

// Gets courses from UW-API
function getCourses(callback) {
  uwclient.get('/courses.json', function (err, res) {
    if (err) return callback(err, null);
    else return callback(null, res.data);
  });
}

// Exports
module.exports = {
  getTerms,
  getCourseInformation,
  getCourseDescription,
  getReqs,
  getCourses,
};
