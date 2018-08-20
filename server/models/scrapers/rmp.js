const cheerio = require('cheerio');
const utils = require('./utils');

function removeMiddleName(name) {
	const names = name.split(" ");
	if (names.length === 2) return name;

	return `${names[0]} ${names[names.length - 1]}`;
}

async function getProfInfo(name, callback) {
	const baseURL = 'http://www.ratemyprofessors.com';
	const parsedName = removeMiddleName(name);
	const url = `${baseURL}/search.jsp?queryBy=teacherName&country=canada&stateselect=ON&queryoption=HEADER&query=${parsedName}&facetSearch=true`;
	let $ = null;

	// Get list of profs
	try {
		const html = await utils.getHTML(url);
		$ = cheerio.load(html);
	} catch (err) {
		console.log(err);
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
		console.log(err);
		return { err, prof: null };
	}

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

	// TODO: Remove prof avatar url
	return {
		err: null,
		prof: {
			rating,
			difficulty,
			tags,
			rmpURL,
			profAvatarURL: 'images/firas_mansour.jpg',
		},
	};
}


module.exports = {
	getProfInfo
};
