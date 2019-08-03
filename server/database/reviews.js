const { reviewsRef } = require('./index');
const profReviewsRef = reviewsRef.child('profs');
const courseReviewsRef = reviewsRef.child('courses');

/*
profReviewsSchema:
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
        rmpId: profReviewsSchema
      },
      wmm: {
        id: profReviewsSchema
      }
    }
  },
  courses: {
    subject: {
      catalogNumber: {
        bird: [
          {
            date,
            comments
          }
        ],
        wmm: {
          date,
          comments,
          advice,
          term,
          year,
          interesting,
          useful,
          easy,
          prof,
          difficulty,
          isMandatory,
          textbookUsed,
          grade,
        }
      }
    }
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

async function deleteProfReview(profName, username) {
  return profReviewsRef
    .child(`${profName.replace(/(\s|\.)/g, '')}/wmm/${username}`)
    .set(null);
}

async function addProfVote(profName, id, username, vote) {
  return profReviewsRef
    .child(`${profName.replace(/(\s|\.)/g, '')}/wmm/${id}/votes/${username}`)
    .set(vote);
}

async function setBirdReviews(subject, catalogNumber, reviews, id) {
  if (reviews == null || reviews.length === 0) return;
  return courseReviewsRef
    .child(`${subject}/${catalogNumber}/bird`)
    .set({ id, reviews });
}

async function addCourseReview(subject, catalogNumber, username, review) {
  return courseReviewsRef
    .child(`${subject}/${catalogNumber}/wmm/${username}`)
    .set(review);
}

async function deleteCourseReview(subject, catalogNumber, username) {
  return courseReviewsRef
    .child(`${subject}/${catalogNumber}/wmm/${username}`)
    .set(null);
}

// id = id of post, username = user who voted
async function addCourseVote(subject, catalogNumber, id, username, vote) {
  return courseReviewsRef
    .child(`${subject}/${catalogNumber}/wmm/${id}/votes/${username}`)
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

async function getCourseReviews(subject, catalogNumber) {
  try {
    const snapshot = await courseReviewsRef
      .child(`${subject}/${catalogNumber}`)
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
  deleteProfReview,
  addProfVote,
  setBirdReviews,
  addCourseReview,
  deleteCourseReview,
  addCourseVote,
  getRmpReviewIds,
  getProfReviews,
  getCourseReviews,
};
