const { reviewsRef } = require('./index');
const profReviewsRef = reviewsRef.child('profs');
const courseReviewsRef = reviewsRef.child('courses');

/*
reviewSchema:
{
  subject,
  catalogNumber,
  date,
  rating,
  difficulty,
  isMandatory,  // attendance
  textbookUsed,
  grade,
  comments,
  numThumbsUp (rmp),
  numThumbsDown (rmp),
  votes: votesSchema (wmm)
}

votesSchema:
{
  userId: -1,1
}

{
  profs: {
    name: {
      rmp: {
        rmpId: reviewSchema
      },
      wmm: {
        id: reviewSchema
      }
    }
  },
  courses: {

  }
}
*/

/****************************
 *                          *
 *      S E T T E R S       *
 *                          *
 ****************************/

function setRmpReview(profName, review) {
  const { id } = review;
  delete review.id;

  return profReviewsRef
    .child(`${profName.replace(/(\s|\.)/g, '')}/rmp/${id}`)
    .set(review);
}

async function addProfReview(profName, username, review) {
  return profReviewsRef
    .child(`${profName.replace(/(\s|\.)/g, '')}/wmm/${username}`)
    .set(review);
}

async function addVote(profName, id, username, vote) {
  return profReviewsRef
    .child(`${profName.replace(/(\s|\.)/g, '')}/wmm/${id}/votes/${username}`)
    .set(vote);
}

/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

async function getRmpReviewIds(prof) {
  try {
    const snapshot = await profReviewsRef
      .child(`${prof.replace(/(\s|\.)/g, '')}/rmp`)
      .once('value');
    const reviews = await snapshot.val() || [];
    return { err: null, reviewIds: Object.keys(reviews) };
  } catch (err) {
    console.error(err);
    return { err: err.message, reviewIds: null };
  }
}

async function getProfReviews(prof) {
  try {
    const snapshot = await profReviewsRef
      .child(prof.replace(/(\s|\.)/g, ''))
      .once('value');
    const reviews = await snapshot.val() || [];
    return { err: null, reviews };
  } catch (err) {
    console.error(err);
    return { err: err.message, reviews: null };
  }
}

module.exports = {
  setRmpReview,
  addProfReview,
  addVote,
  getRmpReviewIds,
  getProfReviews,
};
