import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseInfo from './sidebar/CourseInfo';
import CourseProf from './sidebar/CourseProf';
import '../../stylesheets/CourseSideBar.css';

const styles =  {
	instructor: (isVisible) => ({
		height: 'auto',
		width: 270,
		margin: 15,
		marginLeft: 0,
		display: 'inline-block',
		opacity: (isVisible) ? 1 : 0
	})
};

const retrieveProfInfo = (instructor) => {
	return fetch(`/prof/${instructor}`)
	.then(response => {
		if (!response.ok) {
			throw new Error(`status ${response.status}`);
		}

		return response.json();
	});
};


export default class CourseSideBarContainer extends Component {

	static propTypes = {
		instructor: PropTypes.string.isRequired,
		attending: PropTypes.string.isRequired,
		enrollmentCap: PropTypes.string.isRequired,
		reserved: PropTypes.string.isRequired,
		reservedCap: PropTypes.string.isRequired,
		classNumber: PropTypes.string.isRequired,
		lastUpdated: PropTypes.string.isRequired,
		addToCartHandler: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		const {
			instructor,
			attending,
			enrollmentCap,
			reserved,
			reservedCap,
			classNumber,
			lastUpdated,
			addToCartHandler
		} = props;

		this.state = {
			classNumber,
			instructor,
			info: {
				attending,
				enrollmentCap,
				reserved,
				reservedCap,
				lastUpdated
			},
			prof: null,
			fetchingRMP: false
		};

		this.addToCartHandler = addToCartHandler;
	}

	componentDidMount() {
		if (this.state.instructor) {
			retrieveProfInfo(this.state.instructor)
			.then(prof => {
				this.setState({ fetchingRMP: false });
				if (!prof.error) this.setState({ prof });
				else throw prof.error;
			})
			.catch(error => {
				console.error(`ERROR: ${error}`);
				this.setState({ prof: null });
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		const {
			instructor,
			attending,
			enrollmentCap,
			reserved,
			reservedCap,
			classNumber,
			lastUpdated
		} = nextProps;

		if (classNumber !== this.props.classNumber) {
			this.setState({
				classNumber,
				instructor,
				info: {
					attending,
					enrollmentCap,
					reserved,
					reservedCap,
					lastUpdated
				}
			});

			if (instructor && instructor !== this.props.instructor) {
				this.setState({ fetchingRMP: true });
				retrieveProfInfo(instructor)
				.then(prof => {
					this.setState({ fetchingRMP: false });
					if (!prof.error) this.setState({ prof });
					else throw prof.error;
				})
				.catch(error => {
					console.error(`ERROR: ${error}`);
					this.setState({ prof: null });
				});
			}
		}
	}

	render() {
		const { instructor, info, prof, fetchingRMP } = this.state;
		const id = (instructor) ? 'slide' : '';

		return (
			<div className="course-side-bar">
				<CourseInfo
					style={styles.instructor(instructor)}
					id={id}
					instructor={instructor}
					{...info}
					addToCartHandler={this.addToCartHandler}
				/>
				<CourseProf
					style={styles.instructor(instructor)}
					id={id}
					instructor={instructor}
					loading={fetchingRMP}
					{...prof}
				/>
			</div>
		);
	}

}
