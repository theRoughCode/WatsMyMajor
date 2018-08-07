import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import ArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import CourseInfo from './sidebar/CourseInfo';
import CourseProf from './sidebar/CourseProf';
import '../../stylesheets/CourseSideBar.css';

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
		instructor: PropTypes.string.isRequired,
		attending: PropTypes.string.isRequired,
		enrollmentCap: PropTypes.string.isRequired,
		reserved: PropTypes.string.isRequired,
		reservedCap: PropTypes.string.isRequired,
		classNumber: PropTypes.string.isRequired,
		lastUpdated: PropTypes.string.isRequired,
		open: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		const {
			subject,
			catalogNumber,
			instructor,
			attending,
			enrollmentCap,
			reserved,
			reservedCap,
			classNumber,
			lastUpdated,
		} = props;

		this.state = {
			subject,
			catalogNumber,
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
	}

	async componentDidMount() {
		if (!this.state.instructor) return;

		const { err, prof } = await retrieveProfInfo(this.state.instructor);
		this.setState({ fetchingRMP: false });
		if (err) {
			console.error(`ERROR: ${err}`);
			this.setState({ prof: null });
			return;
		}
		this.setState({ prof });
	}

	componentWillReceiveProps(nextProps) {
		const {
			instructor,
			attending,
			enrollmentCap,
			reserved,
			reservedCap,
			classNumber,
			lastUpdated,
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
		const {
			subject,
			catalogNumber,
			instructor,
			info,
			prof,
			fetchingRMP,
		} = this.state;
		const id = (instructor) ? 'slide' : '';

		return (
			<Drawer open={ this.props.open } openSecondary style={ styles.container }>
				<RaisedButton
					label={ <ArrowIcon style={ styles.arrow } /> }
					labelStyle={ styles.arrowLabel }
					style={ styles.arrowButton }
					onClick={ this.props.onClose }
				/>
				<CourseInfo
					style={ styles.sidebar }
					id={ id }
					subject={ subject }
					catalogNumber={ catalogNumber }
					instructor={ instructor }
					{ ...info }
				/>
				<CourseProf
					style={ styles.sidebar }
					id={ id }
					instructor={ instructor }
					loading={ fetchingRMP }
					{ ...prof }
				/>
			</Drawer>
		);
	}

}
