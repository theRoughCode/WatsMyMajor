const routes = require('express').Router();
const path = require('path');

routes.get('/', function(req, res){
	res.send('By Raphael Koh');
});

routes.use('/courses', require('./courses'));
routes.use('/users', require('./users'));
routes.use('/parse', require('./parse'));
routes.use('/prof', require('./prof'));
routes.use('/reqs', require('./reqs'));
routes.use('/update', require('./update'));
routes.use('/wat', require('./wat'));

// All remaining requests return the React app, so it can handle routing.
routes.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../../react-ui/build', 'index.html'));
});

module.exports = routes;
