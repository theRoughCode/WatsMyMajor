import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import logo from '../logo.svg';


export default class Dashboard extends Component {

	constructor(props) {
		super(props);

		this.state = {

		};
	}

	render() {
		return (
			<div style={{ paddingTop: '65px' }}>
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to React</h2>
				</div>
				<p className="App-intro">
					{'This is '}
					<a href="https://github.com/mars/heroku-cra-node">
						{'create-react-app with a custom Node/Express server'}
					</a><br/>
				</p>
				<RaisedButton label="Default" />
				<p className="App-intro">
					{this.state.fetching
						? 'Fetching message from API'
						: this.state.message}
				</p>
			</div>
		);
	}

}
