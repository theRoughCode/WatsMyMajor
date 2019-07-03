const cheerio = require('cheerio');
const utils = require('./utils');

function removeMiddleName(name) {
  const names = name.split(" ");
  if (names.length === 2) return name;

  return `${names[0]} ${names[names.length - 1]}`;
}

async function getRmpInfo(name) {
  const baseURL = 'http://www.ratemyprofessors.com';
  const parsedName = removeMiddleName(name);
  const url = `${baseURL}/search.jsp?queryBy=teacherName&country=canada&stateselect=ON&queryoption=HEADER&query=${parsedName}&facetSearch=true`;
  let $ = null;

  // Get list of profs
  try {
    const html = await utils.getHTML(url);
    $ = cheerio.load(html);
  } catch (err) {
    console.error(err);
    return { err, prof: null };
  }


  const hasResults = /\d/.test($('.result-count').text());
  if (!hasResults) return { err: 'No results found.' };

  // Get prof URL
  const profURL = $('.listings').children().first().find('a').attr('href');
  const rmpURL = baseURL + profURL;

  try {
    const html = await utils.getHTML(rmpURL);
    $ = cheerio.load(html);
  } catch (err) {
    console.error(err);
    return { err, prof: null };
  }

  const reviews = [];
  $('.tftable').find('tr').each((_, el) => {
    const id = $(el).attr('id');
    const ratingDiv = $(el).find('.rating');
    const date = $(ratingDiv).find('.date').text();
    const breakdown = $(ratingDiv).find('.breakdown');
    let overallScore = 0;
    let difficulty = 0;
    $(breakdown).find('.score').each((i, score) => {
      if (i === 0) overallScore = Number($(score).text());
      else difficulty = Number($(score).text());
    });

    // If empty, ignore
    if (!overallScore || !id) return;


    const classDiv = $(el).find('.class');
    const className = $(classDiv).find('.name').text().trim();
    const classRegex = className.match(/([a-zA-Z]*)(.*)/);
    const subject = classRegex[1];
    const catalogNumber = classRegex[2];
    const isMandatory = $(classDiv).find('.attendance').find('.response').text().indexOf('Not') === -1;
    const textbookUsed = $(classDiv).find('.textbook-used').find('.response').text().toLowerCase() === 'yes';
    const grade = $(classDiv).find('.grade').find('.response').text();

    const commentsDiv = $(el).find('.comments');
    const comments = $(commentsDiv).find('.commentsParagraph').text().trim();
    const numThumbsUp = Number($(commentsDiv).find('.helpful').find('.count').text().trim());
    const numThumbsDown = Number($(commentsDiv).find('.nothelpful').find('.count').text().trim());

    reviews.push({
      id,
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
    });
  });

  const rating = Number($('.quality .grade').text());
  const difficulty = Number($('.difficulty .grade').text().replace(/\s/g, ''));
  const maxNumberOfTags = 3;  // Determines max no. of tags
  const tags = $('.tag-box-choosetags')
    .slice(0, maxNumberOfTags)
    .text()
    .replace(/\([0-9]*\)/g, ',')
    .slice(0, -1)
    .split(',')
    .map(tag => tag.trim());

  return {
    err: null,
    prof: {
      reviews,
      rating,
      difficulty,
      tags,
      rmpURL,
    },
  };
}


module.exports = {
  getRmpInfo
};
