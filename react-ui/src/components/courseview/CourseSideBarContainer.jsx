import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseInfo from './sidebar/CourseInfo';
import CourseProf from './sidebar/CourseProf';

const style = {
	height: 'auto',
	width: 270,
	margin: 15,
	marginRight: 0,
	display: 'inline-block',
};

const retrieveClassInfo = (classNumber) => {
	return {
		instructor: 'Firas Mansour',
		info: {
			enrollmentCap: '50',
			attending: '30'
		},
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
		classNumber: PropTypes.string
  };

	static defaultProps = {
		classNumber: ''
	};

  constructor(props) {
    super(props);

    this.state = {
			classNumber: props.classNumber,
			instructor: '',
			info: {
				enrollmentCap: '',
				attending: ''
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
		const { classNumber } = nextProps;

		if (classNumber !== this.props.classNumber) {
			this.setState({ classNumber });
		}

		this.setState(retrieveClassInfo(this.state.classNumber));
	}

  render() {
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
  }

}
