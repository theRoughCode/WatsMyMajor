import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseInfo from './sidebar/CourseInfo';
import CourseProf from './sidebar/CourseProf';

const style = (isVisible) => ({
	height: 'auto',
	width: 270,
	margin: 15,
	marginLeft: 0,
	display: 'inline-block',
	opacity: (isVisible) ? 1 : 0
});

const retrieveProfInfo = (instructor) => {
	let prof = {};

	if (instructor === 'Firas Mansour') {
		prof = {
			rating: 4.1,
			difficulty: 3.2,
			tags: ['Hilarious', 'Respected', 'Amazing Lectures'],
			rmpURL: 'http://www.ratemyprofessors.com/ShowRatings.jsp?tid=21566',
			profAvatarURL: 'images/firas_mansour.jpg'
		};
	} else if (instructor === 'Stephen New') {
		prof = {
			rating: 4.6,
			difficulty: 4.9,
			tags: ['Respected', 'Inspirational', 'Amazing Lectures'],
			rmpURL: 'http://www.ratemyprofessors.com/ShowRatings.jsp?tid=10101',
			profAvatarURL: 'images/stephen_new.png'
		};
	} else {
		prof = {
			rating: 0,
			difficulty: 0,
			tags: [],
			rmpURL: '',
			profAvatarURL: ''
		};
	}

	return { prof };
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
				rmpURL: '',
				profAvatarURL: ''
			}
		};
	}

	componentDidMount() {
		this.setState(retrieveProfInfo(this.state.instructor));
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
				classNumber,
				instructor,
				info: {
					attending,
					enrollmentCap
				}
			});
		}

		this.setState(retrieveProfInfo(instructor));
	}

	render() {
		const id = (this.state.instructor) ? 'slide' : '';

		return (
			<div className="course-side-bar">
				<CourseInfo
					style={style(this.state.instructor)}
					id={id}
					instructor={this.state.instructor}
					{...this.state.info}
					/>
				<CourseProf
					style={style(this.state.instructor)}
					id={id}
					instructor={this.state.instructor}
					{...this.state.prof}
					/>
			</div>
		);
	}

}
