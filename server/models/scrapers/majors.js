const cheerio = require('cheerio');
const request = require('request');

async function getHTML(url) {
  return new Promise((resolve, reject) => {
    request.get(url, function (err, _, html) {
      if (err) reject(err);
      else resolve(html);
    });
  });
}

async function parseMajor(url) {
  const reqs = [];
  try {
    const html = await getHTML(url);
    const $ = cheerio.load(html);

    $('.MainContent > blockquote').each((i, elem) => {
      let currReq = {
        type: '',
        choose: null,
        courses: [],
      };
      const p = $(elem).prev('p').text().trim();
      switch (p) {
        case 'One of':
          currReq.type = 'choose';
          currReq.choose = 1;
          break;
        case "All of":
          currReq.type = "all";
          break;
        default:
          if (/.*(Two).*(of|from).*/.test(p)) {
            currReq.type = 'choose';
            currReq.choose = 2;
          } else if (/.*(Three).*(of|from).*/.test(p)) {
            currReq.type = 'choose';
            currReq.choose = 3;
          }
      }
      $(elem).find('a').each((i, elem) => {
        const [subject, catalogNumber] = $(elem).text().split(" ");
        currReq.courses.push({ type: 'course', subject, catalogNumber });
      });
      if (currReq.courses.length) reqs.push(currReq);
    });
    return reqs;
  } catch (e) {
    console.error(e);
    return null;
  }
}


module.exports = {
  parseMajor
};
