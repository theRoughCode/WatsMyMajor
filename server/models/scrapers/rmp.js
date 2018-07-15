const request = require('request');
const cheerio = require('cheerio');

function getProfInfo(name, callback) {
	const baseURL = 'http://www.ratemyprofessors.com';
	const url = `${baseURL}/search.jsp?queryBy=teacherName&country=canada&stateselect=ON&queryoption=HEADER&query=${name}&facetSearch=true`;

	request(url, function(error, response, html){
		if(!error){
			let $ = cheerio.load(html);

			const hasResults = /\d/.test($('.result-count').text());

			if (!hasResults) return callback({ error: 'No results' });

			const profURL = $('.listings').children().first().find('a').attr('href');
			const rmpURL = baseURL + profURL;
			request(rmpURL, function(error, response, html) {
				$ = cheerio.load(html);
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

				callback({
					rating,
					difficulty,
					tags,
					rmpURL,
					profAvatarURL: 'images/firas_mansour.jpg'
				});
			});
		}
	});
}


module.exports = {
	getProfInfo
};
