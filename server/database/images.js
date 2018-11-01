const { profilePicBucket } = require('./index');
const stream = require('stream');

const getEasterURL = () => {
  const file = profilePicBucket.file('profile-pictures/easter_egg.jpg');
  return `https://storage.googleapis.com/${profilePicBucket.name}/${file.name}?alt=media`;
}


/****************************
 *													*
 *			S E T T E R S 			*
 *													*
 ****************************/

// Set profile picture from base64Str string
// Returns { err, publicUrl }
async function setProfilePicture(username, { base64Str, contentType }) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(base64Str, 'base64'));

  // Delete user's previous images
  try {
    const err = await profilePicBucket.deleteFiles({ prefix: `profile-pictures/${username}/` });
    // Might return an empty array if successfull.
    if (Array.isArray(err)) {
      if (err.length > 0) return { err };
    } else if (err) return { err };
  } catch (err) {
    return { err };
  }

  const file = profilePicBucket.file(`profile-pictures/${username}/${Date.now()}`);
  const publicUrl = `https://storage.googleapis.com/${profilePicBucket.name}/${file.name}?alt=media`;

  return new Promise((resolve, reject) => {
    bufferStream
      .pipe(file.createWriteStream({
        public: true,
        metadata: {
          contentType,
          cacheControl: 'public, max-age=3600'
        },
      }))
      .on('error', err => resolve({ err }))
      .on('finish', () => resolve({ publicUrl }));
  });
}

// Returns err
async function removeProfilePicture(fileName) {
  if (!fileName) return;

  const file = profilePicBucket.file(fileName);
  return new Promise((resolve, reject) => {
    file.delete((err, resp) => resolve(err));
  });
}

//async function removeUserProfilePictures(username) {
//  // Delete user's previous images
//  try {
//    const err = await profilePicBucket.deleteFiles({ prefix: `profile-pictures/${username}/` });
//    // Might return an empty array if successfull.
//    if (Array.isArray(err)) {
//      if (err.length > 0) return err;
//    } else if (err) return err;
//  } catch (err) {
//    return err;
//  }
//  return null;
//}

module.exports = {
  getEasterURL,
  setProfilePicture,
  removeProfilePicture,
};
