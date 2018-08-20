const request = require('request');

async function getHTML(url) {
  return new Promise((resolve, reject) => {
    request.get(url, function (err, _, html) {
      if (err) {
        console.log(`FAILED: ${url}. Err: ${err.message}`);
        reject(err);
      }
      else resolve(html);
    });
  });
}

module.exports = {
  getHTML,
};
