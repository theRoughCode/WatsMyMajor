const cheerio = require('cheerio');
const utils = require('./utils');

async function getBirdCourses() {
  const baseUrl = 'https://birdcourses.com';
  const url = `${baseUrl}/university.php?university=University+of+Waterloo`;
  let $ = null;

  // Get list of profs
  try {
    const html = await utils.getHTML(url);
    $ = cheerio.load(html);
  } catch (err) {
    console.error(err);
    return null;
  }

  const courses = [];

  $('#list').find('tbody').find('tr').each((i, el) => {
    const title = $(el).children().first().text();
    const index = title.search(/\d/);
    const subject = title.slice(0, index).trim().toUpperCase();
    let catalogNumber = title.slice(index, title.length).trim();
    catalogNumber = catalogNumber.split(' ')[0];
    if (!subject || !catalogNumber) return;
    courses.push({
      subject,
      catalogNumber,
      link: $(el).find('a').prop('href'),
    });
  });

  return courses;
}

async function getBirdInfo(link) {
  const baseUrl = 'https://birdcourses.com';
  const url = `${baseUrl}/${link}`;
  let $ = null;

  // Get list of profs
  try {
    const html = await utils.getHTML(url);
    $ = cheerio.load(html);
  } catch (err) {
    console.error(err);
    return { err, reviews: null };
  }

  const reviews = [];

  $('#reviews').find('table').last().find('tr').each((i, el) => {
    const meta = $(el).find('td').children().first().text();
    const comments = $(el).find('td').contents().last().text().replace(/^\s+|\s+$/g, '');
    let date = meta.split(' - ')[1];
    date = date.split(' ')[0];
    reviews.push({
      comments,
      date
    });
  });

  return { err: null, reviews };
}

module.exports = {
  getBirdCourses,
  getBirdInfo
};
