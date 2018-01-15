import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';


export default class Cart extends Component {

	static propTypes = {
		courses: PropTypes.array.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			courses: props.courses
		};

		this.addCourseHandler = props.addCourseHandler;
		this.removeCourseHandler = props.removeCourseHandler;
	}

	render() {
		return (
			<div className="cart">
				<TermBoard
					boardHeader={'Cart'}
					courses={this.state.courses}
					isCart={true}
					/>
			</div>
		);
	}

}
