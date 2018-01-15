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
		flexDirection: 'column',
		height: '100px'
	},
};

const formatReqs = req => req.subject + ' ' + req.catalogNumber;


export default class CourseRequisites extends Component {

	static propTypes = {
		antireqs: PropTypes.array.isRequired,
		coreqs: PropTypes.array.isRequired,
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

	createReqLink = (arr) => (
		arr.map((req, index) => (
			<a key={index} onClick={() => this.props.selectCourseHandler(req)}>
				{req}
			</a>
		))
	);

	render() {
		const {
			antireqs,
			coreqs,
			prereqs,
			postreqs
		} = this.props;

		const titles = [ 'Prereqs', 'Antireqs', 'Coreqs', 'Postreqs' ];
		const reqs = [
			prereqs.map(formatReqs),
			antireqs.map(formatReqs),
			coreqs.map(formatReqs),
			postreqs.map(formatReqs)
		];
		
		return (
			<div className="course-requisites">
				<Paper zDepth={1}>
					<Tabs
						onChange={this.handleChange}
						value={this.state.slideIndex}
						tabItemContainerStyle={styles.tabHeader}
						inkBarStyle={styles.bar}
					>
						{
							titles
								.filter((title, index) => reqs[index].length)
								.map((title, index) => (
									<Tab
										key={index}
										label={title}
										value={index}
										style={styles.headline}
										/>
								))
						}
					</Tabs>
					<SwipeableViews
						className="reqs-link"
						index={this.state.slideIndex}
						onChangeIndex={this.handleChange}
					>
						{
							reqs
								.filter(req => req.length)
								.map((req, index) => (
									<div key={index} style={styles.slide}>
										{this.createReqLink(req)}
									</div>
								))
						}
					</SwipeableViews>
				</Paper>
			</div>
		);
	}
};
