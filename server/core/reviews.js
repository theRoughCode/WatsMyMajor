const profsDB = require('../database/profs');
const reviewsDB = require('../database/reviews');

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

async function getProfReviews(profName) {
  let { err, reviews } = await reviewsDB.getProfReviews(profName);
  if (err || reviews == null) return { err, reviews: null };
  return { err: null, reviews };
}

module.exports = {
  addProfReview,
  addProfReviewVote,
  getProfInfo,
  getProfReviews,
};
