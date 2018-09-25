const { courseRatingsRef } = require('./index');

/* A list of the course ratings
    {
      subject: {
        catalogNumber: {
          {
            rating: {
              avgRating,
              numRatings,
            },
            userRatings: {
              username: rating
            },
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

// Returns { err, rating }
// Updates total ratings for course and the user's rating object at the same time.
// If the course ratings fails to update, the user's ratings will not update.
async function updateUserRating(username, subject, catalogNumber, rating) {
  const ratingRef = courseRatingsRef.child(`${subject}/${catalogNumber}/rating`);
  const userRef = courseRatingsRef.child(`${subject}/${catalogNumber}/userRatings/${username}`);

  const userSnapshot = await userRef.once('value');
  try {
    const { committed, snapshot } = await ratingRef.transaction(ratingObj => {
      // Has not been set yet
      if (ratingObj == null) return {
        avgRating: rating,
        numRatings: 1,
      };
      let totalRatings = ratingObj.avgRating * ratingObj.numRatings + rating;
      let numRatings = ratingObj.numRatings + 1;
      const prevUserRating = userSnapshot.val();
      if (prevUserRating != null) {
        totalRatings -= prevUserRating;
        numRatings--;
      }
      const avgRating = totalRatings / numRatings;
      return {
        avgRating,
        numRatings,
      };
    });
    if (!committed) {
      console.log(`Not updating rating for ${username} because data was not committed.`);
      return { err: { message: 'Failed to update rating.' }, rating: null };
    }
    await userRef.set(rating);
    return { err: null, rating: snapshot.val() };
  } catch (err) {
    console.log(err);
    return { err, rating: null };
  }
}


/****************************
 *                          *
 *      G E T T E R S       *
 *                          *
 ****************************/

async function getCourseRatings(subject, catalogNumber) {
  try {
    const snapshot = await courseRatingsRef.child(`${subject}/${catalogNumber}/rating`).once('value');
    return { err: null, rating: snapshot.val() };
  } catch (err) {
    return { err, rating: null };
  }
}

module.exports = {
  updateUserRating,
  getCourseRatings,
};
