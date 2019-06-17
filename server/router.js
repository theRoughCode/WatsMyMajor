const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import StaticWrapper from '../react-ui/src/StaticWrapper';
import routes from './uiRoutes';
import { loginUser } from 'actions';
import reducers from 'reducers';

// Server endpoint routes requests to backend server
router.use('/server', require('./routes'));

// All remaining requests return the React app, so it can handle routing.
router.use('*', function(req, res) {
  fs.readFile(path.resolve('./react-ui/build/index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }

    const context = {};
    const store = createStore(reducers, applyMiddleware(apiMiddleware));

    // Determine what data is needed to be pre-fetched
    const dataToFetch = [];

    // Set cookies
    global.cookie = req.cookies;

    // Check if user is logged in
    if (req.cookies.hasOwnProperty('watsmymajor_jwt')) {
      dataToFetch.push(store.dispatch(loginUser()));
    }

    // Use 'some' to imitate <Switch> behaviour
    routes.some(route => {
      const match = matchPath(req.originalUrl, route);

      // If component has loadData property, dispatch the data requirement
      if (match && 'loadData' in route.component) {
        dataToFetch.push(store.dispatch(route.component.loadData(match, req)));
      }
      return match;
    });

    // Render HTML
    Promise.all(dataToFetch).then(() => {
      const jsx = (
        <StaticWrapper
          store={ store }
          location={ req.url }
          context={ context }
        />
      );

      // context.url will contain the URL to redirect to if a <Redirect> was used
      if (context.url) redirect(301, context.url);
      else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          data.replace(
            '<div id="root"></div>',
            `<div id="root">${ renderToString(jsx) }</div>
             <script>window.REDUX_DATA = ${ JSON.stringify(store.getState()) }</script>`
          )
        );
      }
    }).catch(err => {
      console.log(err);
      res.status(500).send('An error occurred');
    });
  });
});

module.exports = router;
