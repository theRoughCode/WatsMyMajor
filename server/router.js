const router = require('express').Router();
const passport = require('passport');
const path = require('path');
const routes = require('./routes');

// Server endpoint routes requests to backend server
router.use('/server', routes);

// All remaining requests return the React app, so it can handle routing.
router.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../../react-ui/build', 'index.html'), err => {
    if (err) {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
