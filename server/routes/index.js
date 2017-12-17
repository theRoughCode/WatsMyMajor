const routes = require('express').Router();
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const waterloo = require('./waterloo');

routes.get('/', function(req, res){
	res.render('index');
});

routes.get('/wat/:subject/:number', function(req, res){
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');

	waterloo.getReqInfo(subject, number, output => {
		waterloo.getParentReqs(subject, number, parents => {
			waterloo.getCourseInfo(subject, number, classes => {
				output["parPrereq"] = (parents[0].length > 0) ? parents[0] : [];
				output["parCoreq"] = (parents[1].length > 0) ? parents[1] : [];
				output["classList"] = classes;
				res.json(output);
			});
		});
	});
});

routes.get('/wat/class/:subject/:number', function(req, res) {
	const subject = req.params.subject.toUpperCase();
	const number = req.params.number;

	res.set('Content-Type', 'application/json');
	waterloo.getCourseInfo(subject, number, classes => {
		res.json(classes);
	});
});


// Get professor rating from ratemyprofessors.com
routes.get('/prof/:name', function(req, res) {
	const name = req.params.name;
	const baseURL = 'http://www.ratemyprofessors.com';
	const url = `${baseURL}/search.jsp?queryBy=teacherName&country=canada&stateselect=ON&queryoption=HEADER&query=${name}&facetSearch=true`;

	request(url, function(error, response, html){
		if(!error){
			let $ = cheerio.load(html);

			const hasResults = /\d/.test($('.result-count').text());

			if (!hasResults) return res.json({ error: 'No results' });

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

				res.json({
					rating,
					difficulty,
					tags,
					rmpURL,
					profAvatarURL: 'images/firas_mansour.jpg'
				});
			});
		}
	})
});

// All remaining requests return the React app, so it can handle routing.
routes.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../../react-ui/build', 'index.html'));
});


module.exports = routes;
