import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';


export default class ReactAvatar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			name: 'Raphael Koh'
		};
	}

	render() {
		return (
			<div className="avatar-wrapper">
				<Avatar
					className="avatar-icon"
					src='images/avatar.jpg'
					size={100}
					/>
				<span className="avatar-name">{this.state.name}</span>
			</div>
		);
	}

}
