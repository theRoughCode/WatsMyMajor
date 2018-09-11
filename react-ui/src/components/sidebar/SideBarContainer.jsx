import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import SchoolIcon from 'material-ui/svg-icons/social/school';
import MyCoursesIcon from 'material-ui/svg-icons/social/person';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import Avatar from './Avatar';
import GithubIcon from '../tools/GithubIcon';
import { fireLoginPrompt } from '../tools/LoginPrompt';
import {
	darkBlue,
	lightGrey,
	green,
	white
} from '../../constants/Colours';

const styles = {
	drawer: {
		zIndex: 1000,
		position: 'fixed',
		textAlign: 'left',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: darkBlue,
	},
	avatarMenuItem: {
		marginTop: '60px',
		paddingTop: '20px',
		paddingBottom: '5px',
		backgroundColor: darkBlue,
	},
	divider: {
		width: '80%',
		height: 1.5,
		margin: 'auto',
		marginLeft: 'auto',
	},
	listItem: (isSelected) => ({
		backgroundColor: (isSelected) ? green : 'inherit',
		color: (isSelected) ? white : lightGrey,
	}),
	github: {
		marginBottom: 20,
		display: 'flex',
	},
	githubTextContainer: {
		margin: 'auto',
		color: white,
	},
	githubIcon: {
		marginLeft: 10,
		verticalAlign: 'text-bottom',
		color: white,
	}
}

class SideBarContainer extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		profileURL: PropTypes.string,
		isLoggedIn: PropTypes.bool.isRequired,
		open: PropTypes.bool.isRequired,
		location: PropTypes.object.isRequired, // router
	};
	static defaultProps = {
	  profileURL: '',
	};

	state = {
		pathname: this.props.location.pathname
	};

	componentDidMount() {
		this.props.history.listen(location => {
		  if (location.pathname !== this.state.pathname) {
				this.setState({ pathname: location.pathname });
		  }
		});
	}

	onNavClick = (to) => {
		const { isLoggedIn, history } = this.props;
		if (isLoggedIn) this.props.history.push(to);
		else fireLoginPrompt(history, to);
	}

	render() {
		const { name, profileURL, isLoggedIn, open, history } = this.props;
		const { pathname } = this.state;

		return (
			<Drawer open={ open } width={ 200 } containerStyle={ styles.drawer }>
				<MenuItem
					className="avatar-menu"
					style={ styles.avatarMenuItem }
					onClick={ () => history.push('/settings') }
					disabled={ !isLoggedIn }
				>
					{ isLoggedIn && <Avatar name={ name } profileURL={ profileURL } /> }
				</MenuItem>
				<Divider style={ styles.divider } />
				<List style={{ flex: 1 }}>
					<ListItem
						primaryText={ <span>Dashboard</span> }
						leftIcon={<DashboardIcon color={ white } />}
						style={ styles.listItem(pathname === "/") }
						onClick={ this.onNavClick.bind(this, '/') }
					/>
					<ListItem
						primaryText={ <span>View Majors</span> }
						leftIcon={<SchoolIcon color={ white } />}
						style={ styles.listItem(pathname.startsWith("/majors")) }
						containerElement={ <Link to="/majors" /> }
					/>
					<ListItem
						primaryText={ <span>My Courses</span> }
						leftIcon={<MyCoursesIcon color={ white } />}
						style={ styles.listItem(pathname === "/my-courses") }
						onClick={ this.onNavClick.bind(this, '/my-courses') }
					/>
					<ListItem
						primaryText={ <span>My Schedule</span> }
						leftIcon={<ScheduleIcon color={ white } />}
						style={ styles.listItem(pathname === "/schedule") }
						onClick={ this.onNavClick.bind(this, '/schedule') }
					/>
				</List>
				<div style={ styles.github }>
					<div style={ styles.githubTextContainer }>
						<span>Found an issue?</span>
						<a target="_blank" rel="noopener noreferrer" href="https://github.com/theRoughCode/watsmymajorbeta/issues">
							<GithubIcon style={ styles.githubIcon} />
						</a>
					</div>
				</div>
			</Drawer>
		);
	}
}

const mapStateToProps = ({ isLoggedIn, user }) => {
  const { name, profileURL } = user;
  return { isLoggedIn, name, profileURL };
};

export default withRouter(connect(mapStateToProps)(SideBarContainer));
