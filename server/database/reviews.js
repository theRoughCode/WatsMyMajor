const { reviewsRef } = require('./index');
const profReviewsRef = reviewsRef.child('profs');
const courseReviewsRef = reviewsRef.child('courses');

/*
review schema:
{
  subject,
  catalogNumber,
  date,
  overallScore,
  difficulty,
  isMandatory,
  textbookUsed,
  grade,
  comments,
  numThumbsUp,
  numThumbsDown,
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

/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

async function getRmpReviewIds(prof) {
  try {
    const snapshot = await profReviewsRef
      .child(`${prof.replace(/\s/g, '')}/rmp`)
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
      .child(prof.replace(/\s/g, ''))
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
  getRmpReviewIds,
  getProfReviews,
};
