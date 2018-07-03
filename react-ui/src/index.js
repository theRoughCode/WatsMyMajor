import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import logger from 'redux-logger';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './App';
import './stylesheets/index.css';
import reducers from './reducers/index';

const store = createStore(
	reducers,
	applyMiddleware(apiMiddleware, logger)
);

const theme = createMuiTheme();

const Wrapper = () => (
	<Provider store={store}>
		<Router>
			<MuiThemeProvider theme={theme}>
				<App />
			</MuiThemeProvider>
		</Router>
	</Provider>
);

ReactDOM.render(
	<Wrapper />,
	document.getElementById('root')
);
