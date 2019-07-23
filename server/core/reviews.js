const profsDB = require('../database/profs');
const reviewsDB = require('../database/reviews');
const usersDB = require('../database/users');

async function addProfReview(profName, username, review) {
  let err = null;
  if (profName == null) err = 'Invalid prof name';
  if (username == null) err = 'Invalid username';
  if (review == null) err = 'Invalid review';
  if (err) return err;

  const today = new Date();
  let dd = today.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = today.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  const yy = today.getFullYear();
  const date = `${mm}/${dd}/${yy}`;

  if (review.grade != null && review.grade.length === 0) review.grade = null;
  else if (review.grade != null) review.grade = review.grade.toString();
  review.date = date;
  review.votes = {};

  try {
    await reviewsDB.addProfReview(profName, username, review);
    const updates = {};
    updates[`/reviews/profs/${profName}`] = true;
    await usersDB.updateUser(username, updates);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function deleteProfReview(profName, username) {
  try {
    await reviewsDB.deleteProfReview(profName, username);
    const updates = {};
    updates[`/reviews/profs/${profName}`] = null;
    await usersDB.updateUser(username, updates);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function addProfReviewVote(profName, id, username, vote) {
  let err = null;
  if (profName == null) err = 'Invalid prof name';
  if (id == null) err = 'Invalid id';
  if (username == null) err = 'Invalid username';
  if (vote == null) err = 'Invalid vote';
  if (err) return err;

  try {
    await reviewsDB.addVote(profName, id, username, vote);
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function getProfInfo(profName) {
  let { err, prof } = await profsDB.getProf(profName);
  if (err || prof == null) return { err, info: null };
  return { err: null, info: prof };
}

async function getProfNames(list) {
  try {
    let failedList = [];
    const promises = Object.keys(list).map(async id => {
      const { err, info } = await getProfInfo(id);
      if (err) {
        failedList.push(id);
        return null;
      } else return { id, name: info.name };
    });
    if (failedList.length > 0) return { err: `Failed to retrieve ${failedList[0]}.`, names: null };
    const names = await Promise.all(promises);
    return { err: null, names };
  } catch (err) {
    console.error(err);
    return { err, names: null };
  }
}

async function getProfReviews(profName) {
  let { err, reviews } = await reviewsDB.getProfReviews(profName);
  if (err || reviews == null) return { err, reviews: null };
  return { err: null, reviews };
}

module.exports = {
  addProfReview,
  deleteProfReview,
  addProfReviewVote,
  getProfInfo,
  getProfNames,
  getProfReviews,
};
