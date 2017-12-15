import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseInfo from './sidebar/CourseInfo';
import CourseProf from './sidebar/CourseProf';

const style = {
	height: 'auto',
	width: 270,
	margin: 15,
	marginLeft: 0,
	display: 'inline-block',
};

const retrieveClassInfo = (classNumber) => {
	return {
		prof: {
			rating: 4.1,
			difficulty: 3.2,
			tags: ['Hilarious', 'Respected', 'Amazing Lectures'],
			rmpURL: 'http://www.ratemyprofessors.com/ShowRatings.jsp?tid=21566'
		}
	}
};


export default class CourseSideBarContainer extends Component {

	static propTypes = {
		instructor: PropTypes.string.isRequired,
		attending: PropTypes.string.isRequired,
		enrollmentCap: PropTypes.string.isRequired,
		classNumber: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);

		const {
			instructor,
			attending,
			enrollmentCap,
			classNumber
		} = props;

		this.state = {
			classNumber,
			instructor,
			info: {
				enrollmentCap,
				attending
			},
			prof: {
				rating: 0,
				difficulty: 0,
				tags: [],
				rmpURL: ''
			}
		};
	}

	componentDidMount() {
		this.setState(retrieveClassInfo(this.state.classNumber));
	}

	componentWillReceiveProps(nextProps) {
		const {
			instructor,
			attending,
			enrollmentCap,
			classNumber
		} = nextProps;

		if (classNumber !== this.props.classNumber) {
			this.setState({
				instructor,
				info: {
					attending,
					enrollmentCap
				},
				classNumber
			});
		}

		this.setState(retrieveClassInfo(this.state.classNumber));
	}

	render() {
		if (this.state.instructor) {
			return (
				<div className="course-side-bar">
					<CourseInfo
						style={style}
						instructor={this.state.instructor}
						{...this.state.info}
						/>
					<CourseProf
						style={style}
						instructor={this.state.instructor}
						{...this.state.prof}
						/>
				</div>
			);
		} else {
			return (
				<div className="course-side-bar"></div>
			)
		}

	}

}
