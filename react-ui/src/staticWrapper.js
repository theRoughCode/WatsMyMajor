// Used to serve the static server-side rendered app

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import 'stylesheets/index.css';

const StaticWrapper = ({ store, location, context }) => (
  <Provider store={ store }>
    <MuiThemeProvider>
      <Router location={ location } context={ context }>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>
);

StaticWrapper.propTypes = {
  store: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired,
};

export default StaticWrapper;
