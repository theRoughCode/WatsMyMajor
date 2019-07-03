const profsDB = require('../database/profs');
const reviewsDB = require('../database/reviews');

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
  getProfInfo,
  getProfReviews,
};
