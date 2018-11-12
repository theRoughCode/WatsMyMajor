const { majorsRef } = require('./index');

/*  ReqTypes
  - course:
    - subject: string
    - catalogNumber: string
  - range:
    - subject: string
    - from: string
    - to: string
    - excluding (optional): [string]
  - option: (AMATH 242/CS 371)
    - options: array
      - subject
      - catalogNumber
      OR
      - type: sum
      - courses: [
        - subject
        - catalogNumber
      ]
  - level: (300-level CS course)
    - subject: string
    - catalogNumber: string (300+ will allow any above)
    - note: string
  - subject: (Any [faculty]/[subject] course)
    - subject: string
    - note: string
  - subject-level: (Any 300 or 400 level math course)
    - subject: string
    - catalogNumber: string (i.e. 300, 400)
    - excluding (optional): [string]
    - note: string
  - any (any course)
*/

/*  DATA SCHEMA
{
  type: string
  choose: number      - Choose x from
  courses: [ReqTypes]
}
*/

/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

async function setMajorRequirements(faculty, key, value) {
  try {
    await majorsRef.child(`${faculty}/${key}`).set(value);
    return null;
  } catch (err) {
    return err;
  }
}

/****************************
  *													*
  *			G E T T E R S 			*
  *													*
  ****************************/

async function getMajorRequirements(faculty, key) {
  try {
    const snapshot = await majorsRef.child(`${faculty}/${key}`).once('value');
    const data = snapshot.val();
    return { err: null, data };
  } catch (err) {
    return { err, data: null };
  }
}

// Gets list of majors for a certain faculty
async function getMajorsList(faculty) {
  try {
    const snapshot = await majorsRef.child(faculty).once('value');
    if (!snapshot.exists()) return { err: 'Faculty does not exist', majors: null };

    const val = snapshot.val();
    const majors = Object.keys(val).map((key) => ({
      key,
      name: val[key].name
    }));
    return { err: null, majors };
  } catch (err) {
    return { err, majors: null };
  }
}

// Gets list of faculties
async function getFacultiesList() {
  try {
    const snapshot = await majorsRef.child('faculties').once('value');
    const val = snapshot.val();
    const list = Object.keys(val).map((key) => ({
      key,
      name: val[key]
    }));
    return { err: null, list };
  } catch (err) {
    return { err, list: null };
  }
}

// Gets enture list of faculties and respective majors
async function getList() {
  try {
    const snapshot = await majorsRef.child('faculties').once('value');
    const val = snapshot.val();
    const list = {};
    await Promise.all(Object.keys(val).map(async (faculty) => {
      const { err, majors } = await getMajorsList(faculty);
      if (err) return null;
      list[faculty] = { name: val[faculty], majors: {} };
      majors.forEach(({ key, name }) => list[faculty].majors[key] = name);
      return;
    }));
    return { err: null, list };
  } catch (err) {
    return { err, list: null };
  }
}

module.exports = {
  setMajorRequirements,
  getMajorRequirements,
  getMajorsList,
  getFacultiesList,
  getList,
};
