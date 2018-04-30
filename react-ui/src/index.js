import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import './stylesheets/index.css';
import reducers from './reducers/index';

const store = createStore(reducers);

const Wrapper = () => (
	<Provider store={store}>
		<MuiThemeProvider>
			<Router>
				<App />
			</Router>
		</MuiThemeProvider>
	</Provider>
);

ReactDOM.render(
	<Wrapper />,
	document.getElementById('root')
);
