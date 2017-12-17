const routes = require('express').Router();
const path = require('path');
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

// All remaining requests return the React app, so it can handle routing.
routes.get('*', function(request, res) {
  res.sendFile(path.resolve(__dirname, '../../react-ui/build', 'index.html'));
});


module.exports = routes;
