import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import ArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import CourseInfo from './CourseInfo';
import CourseProf from './CourseProf';
import '../../../stylesheets/CourseSideBar.css';

const styles =  {
	container: {
	  display: 'flex',
	  flexDirection: 'column',
	},
	arrowButton: {
		width: '100%',
	},
	arrowLabel: {
		margin: 'auto 10px',
	},
	arrow: {
		float: 'left',
		width: 30,
		height: 30,
	},
	sidebar: {
		height: 'auto',
		width: '100%',
		display: 'inline-block',
		marginBottom: 10,
	}
};

async function retrieveProfInfo(instructor) {
	try {
		const response = await fetch(`/server/prof/${instructor}`, {
			headers: {
				'x-secret': process.env.REACT_APP_SERVER_SECRET
			}
		});

		if (!response.ok) return { err: `status ${response.status}`, prof: null };

		const prof = await response.json();
		return { err:  null, prof };
	} catch (err) {
		return { err, prof: null };
	}
};


export default class CourseSideBarContainer extends Component {
	static propTypes = {
		subject: PropTypes.string.isRequired,
		catalogNumber: PropTypes.string.isRequired,
		classInfo: PropTypes.object.isRequired,
		open: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	state = {
		prof: {},
		fetchingRMP: false
	};

	async componentDidMount() {
		const { instructor } = this.props.classInfo;
		this.updateProfInfo(instructor);
	}

	componentWillReceiveProps(nextProps) {
		const { instructor } = nextProps.classInfo;

		if (instructor !== this.props.instructor) {
			this.setState({ fetchingRMP: true });
			this.updateProfInfo(instructor);
		}
	}

	async updateProfInfo(instructor) {
		if (!instructor) return this.setState({ fetchingRMP: false, prof: {} });;

		const { err, prof } = await retrieveProfInfo(instructor);
		this.setState({ fetchingRMP: false });
		if (err) {
			console.error(`ERROR: ${err}`);
			this.setState({ prof: {} });
			return;
		}
		this.setState({ prof });
	}

	render() {
		const  { subject, catalogNumber, classInfo, open, onClose } = this.props;
		const { prof, fetchingRMP } = this.state;
		const {
			units,
			note,
			enrollmentCap,
			enrollmentTotal,
		  waitingCap,
		  waitingTotal,
			reserveCap,
			reserveTotal,
			reserveGroup,
			instructor,
			lastUpdated,
		} = classInfo;
		const info = {
			units,
			note,
			enrollmentCap,
			attending: enrollmentTotal,
		  waitingCap,
		  waiting: waitingTotal,
			reserveCap,
			reserved: reserveTotal,
			reserveGroup,
			lastUpdated,
		};

		return (
			<Drawer open={ open } openSecondary style={ styles.container }>
				<RaisedButton
					label={ <ArrowIcon style={ styles.arrow } /> }
					labelStyle={ styles.arrowLabel }
					style={ styles.arrowButton }
					onClick={ onClose }
				/>
				<CourseInfo
					subject={ subject }
					catalogNumber={ catalogNumber }
					instructor={ instructor }
					info={ info }
					style={ styles.sidebar }
				/>
				<CourseProf
					instructor={ instructor }
					loading={ fetchingRMP }
					prof={ prof }
					style={ styles.sidebar }
				/>
			</Drawer>
		);
	}

}
