const router = require('express').Router();
const passport = require('passport');
const path = require('path');

// Server endpoint routes requests to backend server
router.use('/server', require('./routes'));

// All remaining requests return the React app, so it can handle routing.
router.use('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'), err => {
    if (err) {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
