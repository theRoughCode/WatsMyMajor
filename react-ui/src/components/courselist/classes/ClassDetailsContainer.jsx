import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ClassInfo from './ClassInfo';
import ClassProf from './ClassProf';
import '../../../stylesheets/ClassDetails.css';

const styles =  {
	header: {
		padding: '10px 20px',
	  textAlign: 'left',
		display: 'flex',
		flexDirection: 'column',
	},
	headerText: {
		marginLeft: 0,
	  fontSize: 30,
	  fontWeight: 400,
	},
	lastUpdated: {
		fontSize: 12,
		marginLeft: 2,
	},
	dialog: {
		width: 'fit-content',
		maxWidth: 'none',
	},
	container: {
	  display: 'flex',
		flexDirection: 'column',
		paddingBottom: 0,
	},
	body: {
		display: 'flex',
	},
	note: {
		fontSize: 13,
		marginTop: 30,
	},
	actions: {
		paddingTop: 0,
	},
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


export default class ClassDetailsContainer extends Component {
	static propTypes = {
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
		const  { classInfo, open, onClose } = this.props;
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

		const actions = [
      <FlatButton
        label="Close"
        onClick={ onClose }
      />
    ];

		return (
			<Dialog
				title={
					<div style={ styles.header }>
						<span style={ styles.headerText }>Class Information</span>
						<span style={ styles.lastUpdated }>Last updated: { lastUpdated }</span>
					</div>
				}
				open={ open }
				actions={ actions }
				onRequestClose={ onClose }
				contentStyle={ styles.dialog }
				bodyStyle={ styles.container }
				actionsContainerStyle={ styles.actions }
			>
				<div style={ styles.body }>
					<ClassInfo
						units={ units }
						attending={ enrollmentTotal }
						enrollmentCap={ enrollmentCap }
						waiting={ waitingTotal }
						waitingCap={ waitingCap }
						reserved={ reserveTotal }
						reserveCap={ reserveCap }
						reserveGroup={ reserveGroup }
					/>
				<ClassProf
						instructor={ instructor }
						loading={ fetchingRMP }
						prof={ prof }
					/>
				</div>
				{
					(note.length > 0) && (
						<i style={ styles.note }>{ `Note: ${note}` }</i>
					)
				}
		</Dialog>
		);
	}

}
