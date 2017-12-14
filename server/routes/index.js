const routes = require('express').Router();
const path = require('path');
const waterloo = require('./waterloo');

routes.get('/', function(req, res){
  res.render('index');
});

routes.get('/wat/:course/:number', function(req, res){
  const course = req.params.course.toUpperCase();
  const number = req.params.number;

  res.set('Content-Type', 'application/json');

  waterloo.getReqInfo(course, number, output => {
    waterloo.getParentReqs(course, number, parents => {
      output["parPrereq"] = (parents[0].length > 0) ? parents[0] : [];
      output["parCoreq"] = (parents[1].length > 0) ? parents[1] : [];
      res.json(output);
    });
  });
});

// All remaining requests return the React app, so it can handle routing.
routes.get('*', function(request, res) {
  res.sendFile(path.resolve(__dirname, '../../react-ui/build', 'index.html'));
});


module.exports = routes;
