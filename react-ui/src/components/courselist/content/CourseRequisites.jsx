import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import SwipeableViews from 'react-swipeable-views';
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


export default class CourseRequisites extends Component {

	static propTypes = {
		antireqs: PropTypes.array.isRequired,
		coreqs: PropTypes.array.isRequired,
		prereqs: PropTypes.object.isRequired,
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

	formatReqs = ({ subject, catalogNumber }, index) => (
		<a key={index} onClick={() => this.props.selectCourseHandler(subject, catalogNumber)}>
			{ `${subject} ${catalogNumber}` }
		</a>
	);

	formatPrereqs = (prereq, index) => {
		if (!Object.keys(prereq).length) return [];
		// Base case: list of courses
		if (prereq.hasOwnProperty('subject')) {
			return this.formatReqs(prereq, index);
		}

		// Inductive case: list of courses with choose
		switch (prereq.choose) {
			case 0: return prereq.reqs.map(this.formatPrereqs);
			default:
				const newReqsArr = prereq.reqs.map(this.formatPrereqs);
				return [
					<Prereqs
						key={0}
						choose={ prereq.choose }
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
		} = this.props;

		const titles = [ 'Prereqs', 'Antireqs', 'Coreqs', 'Postreqs' ];
		const reqs = [
			this.formatPrereqs(prereqs),
			antireqs.map(this.formatReqs),
			coreqs.map(this.formatReqs),
			postreqs.map(this.formatReqs)
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
