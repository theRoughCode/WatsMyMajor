import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { hasTakenCourse } from '../../../utils/courses';
import Prereqs from './Prereqs';


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

class CourseRequisites extends Component {

	static propTypes = {
		antireqs: PropTypes.array.isRequired,
		coreqs: PropTypes.array.isRequired,
		prereqs: PropTypes.object.isRequired,
		postreqs: PropTypes.array.isRequired,
		selectCourse: PropTypes.func.isRequired,
		myCourses: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);

		const {
			antireqs,
			coreqs,
			prereqs,
			postreqs
		} = this.props;

		this.state = {
			slideIndex: 0,
			prereqs: this.formatPrereqs(prereqs),
			coreqs: coreqs.map(this.formatReqs),
			antireqs: antireqs.map(this.formatReqs),
			postreqs: postreqs.map(this.formatReqs),
		};
	}

	handleChange = (value) => {
		this.setState({
			slideIndex: value,
		});
	};

	formatReqs = (course, index) => {
		if (typeof course === "string") return course;

		const { myCourses } = this.props;
		const { subject, catalogNumber } = course;
		let style = {};

		if (hasTakenCourse(subject, catalogNumber, myCourses)) {
			style = {
				color: 'green'
			};
		}

		return (
			<a
				key={ index }
				onClick={ () => this.props.selectCourse(subject, catalogNumber) }
				style={ style }
			>
				{ `${subject} ${catalogNumber}` }
				{ hasTakenCourse(subject, catalogNumber, myCourses) ? ' ✔' : '' }
			</a>
		)
	}

	formatPrereqs = (prereqs, index) => {
		if (!Object.keys(prereqs).length) return [];
		// Base case: list of courses
		if (prereqs.hasOwnProperty('subject')) {
			return this.formatReqs(prereqs, index);
		}

		// Inductive case: list of courses with choose
		switch (prereqs.choose) {
			case 0: return prereqs.reqs.map(this.formatPrereqs);
			default:
				const newReqsArr = prereqs.reqs.map(this.formatPrereqs);
				return [
					<Prereqs
						key={0}
						choose={ prereqs.choose }
						reqs={ newReqsArr }
					/>
				];
		}
	};

	render() {
		const {
			antireqs,
			coreqs,
			prereqs,
			postreqs
		} = this.state;

		const titles = [ 'Prereqs', 'Antireqs', 'Coreqs', 'Postreqs' ];
		const reqs = [ prereqs, antireqs, coreqs, postreqs ];

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
								.filter((title, index) => (!Array.isArray(reqs[index]) &&
									Object.keys(reqs[index]).length) || reqs[index].length)
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
										{ req }
									</div>
								))
						}
					</SwipeableViews>
				</Paper>
			</div>
		);
	}
};

const mapStateToProps = ({ myCourses }) => {
	return { myCourses };
};

export default connect(mapStateToProps, null)(CourseRequisites);
