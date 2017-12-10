import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import './stylesheets/index.css';

const Wrapper = () => (
	<MuiThemeProvider>
		<App />
	</MuiThemeProvider>
);

ReactDOM.render(
	<Wrapper />,
	document.getElementById('root')
);
