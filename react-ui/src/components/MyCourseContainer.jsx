import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingView from './tools/LoadingView';
import ErrorView from './tools/ErrorView';


const getUserCourses = (userID) => {
	return {
		'1A': {
			term: 'F',
			year: '2016',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '135'
				},
				{
					subject: 'MATH',
					catalogNumber: '145'
				},
				{
					subject: 'PHYS',
					catalogNumber: '121'
				},
				{
					subject: 'MATH',
					catalogNumber: '137'
				},
				{
					subject: 'MATH',
					catalogNumber: '137'
				}
			]
		},
		'1B': {
			term: 'W',
			year: '2017',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '136'
				},
				{
					subject: 'MATH',
					catalogNumber: '146'
				},
				{
					subject: 'PHYS',
					catalogNumber: '122'
				},
				{
					subject: 'PHYS',
					catalogNumber: '124'
				},
				{
					subject: 'MATH',
					catalogNumber: '138'
				},
				{
					subject: 'ECON',
					catalogNumber: '101'
				}
			]
		},
		'2A': {
			term: 'S',
			year: '2017',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '246'
				},
				{
					subject: 'MATH',
					catalogNumber: '237'
				},
				{
					subject: 'CS',
					catalogNumber: '240E'
				},
				{
					subject: 'PHYS',
					catalogNumber: '234'
				},
				{
					subject: 'AMATH',
					catalogNumber: '250'
				},
				{
					subject: 'STAT',
					catalogNumber: '230'
				}
			]
		},
		'2B': {
			term: 'W',
			year: '2018',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '240E'
				},
				{
					subject: 'CS',
					catalogNumber: '241'
				},
				{
					subject: 'CS',
					catalogNumber: '251'
				},
				{
					subject: 'MATH',
					catalogNumber: '239'
				},
				{
					subject: 'SPCOM',
					catalogNumber: '225'
				},
				{
					subject: 'STAT',
					catalogNumber: '231'
				}
			]
		}
	}
}


class MyCourseContainer extends Component {

	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			courseList: {}
		};
	}

	componentDidMount() {
	  const courseList = getUserCourses(1);
		this.setState({
			loading: false,
			courseList
		});
	}

	render() {
		if (this.state.loading) {
			return <LoadingView />;
		} else if (this.state.error) {
			return (
				<ErrorView
					msgHeader={`Oops!  We encountered an error trying to fetch ${this.state.subject} ${this.state.catalogNumber}.`}
					msgBody={`Error message: ${this.state.error}`}
				/>
			);
		} else {
			return <div>MyComponent</div>;
		}
	}

}

export default connect(null, null)(MyCourseContainer);
