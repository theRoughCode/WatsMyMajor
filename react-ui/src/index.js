import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import logger from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import 'stylesheets/index.css';
import reducers from 'reducers';

const middlewares = [apiMiddleware];
if (process.env.NODE_ENV !== 'production') middlewares.push(logger);

// Grab state from var injected into server-generated HTML
// const store = createStore(window.REDUX_DATA);
const store = createStore(
  reducers,
  window.REDUX_DATA,
  applyMiddleware(...middlewares)
);

// Allow preloaded redux data to be garbage collected
delete window.REDUX_DATA;

const jsx = (
  <Provider store={ store }>
    <MuiThemeProvider>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.hydrate(
  jsx,
  document.getElementById('root')
);
