import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import SwipeableViews from 'react-swipeable-views';


const styles = {
	tabHeader: {
		backgroundColor: 'rgb(54, 65, 80)'
	},
	bar: {
		backgroundColor: '#ffcc00'
	},
	headline: {
		fontSize: 13,
		paddingTop: 2,
		marginBottom: 2,
		fontWeight: 400,
	},
	slide: {
		padding: 10,
		display: 'flex',
		flexDirection: 'column'
	},
};


export default class CourseRequisites extends Component {

	static propTypes = {
		antireqs: PropTypes.array.isRequired,
		prereqs: PropTypes.array.isRequired,
		postreqs: PropTypes.array.isRequired,
		selectCourseHandler: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			slideIndex: 0,
		};
	}

	handleChange = (value) => {
		this.setState({
			slideIndex: value,
		});
	};

	reqs = (arr) => (
		arr.map((req, index) => (
			<a key={index} onClick={() => this.props.selectCourseHandler(req)}>
				{req}
			</a>
		))
	);

	render() {
		const {
			antireqs,
			prereqs,
			postreqs
		} = this.props;

		return (
			<div className="course-requisites">
				<Paper zDepth={1}>
					<Tabs
						onChange={this.handleChange}
						value={this.state.slideIndex}
						tabItemContainerStyle={styles.tabHeader}
						inkBarStyle={styles.bar}
					>
						<Tab label="Prereqs" value={0} style={styles.headline} />
						<Tab label="Antireqs" value={1} style={styles.headline} />
						<Tab label="postreqs" value={2} style={styles.headline} />
					</Tabs>
					<SwipeableViews
						className="reqs-link"
						index={this.state.slideIndex}
						onChangeIndex={this.handleChange}
					>
						<div style={styles.slide}>
							{this.reqs(prereqs)}
						</div>
						<div style={styles.slide}>
							{this.reqs(antireqs)}
						</div>
						<div style={styles.slide}>
							{this.reqs(postreqs)}
						</div>
					</SwipeableViews>
				</Paper>
			</div>
		);
	}
};
