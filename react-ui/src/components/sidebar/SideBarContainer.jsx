import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import SchoolIcon from 'material-ui/svg-icons/social/school';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import MyCoursesIcon from 'material-ui/svg-icons/social/person';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import Avatar from './Avatar';

const styles = {
	drawer: {
		zIndex: 1000,
		position: 'absolute',
		textAlign: 'left'
	},
	avatarMenuItem: {
		marginTop: '60px',
		paddingTop: '20px',
		paddingBottom: '5px',
		backgroundColor: 'rgb(54, 65, 80)'
	},
	listItem: (isSelected) => {
		if (isSelected) return { backgroundColor: 'rgba(0, 0, 0, 0.1)' };
		else return {};
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

	render() {
		const { name, profileURL, isLoggedIn, open, history } = this.props;
		const { pathname } = this.state;

		return (
			<Drawer open={ open } style={ styles.drawer }>
				<MenuItem
					style={ styles.avatarMenuItem }
					onClick={ () => history.push('/settings') }
				>
					{ isLoggedIn && <Avatar name={ name } profileURL={ profileURL } /> }
				</MenuItem>
				<List>
					<ListItem
						primaryText="Dashboard"
						leftIcon={<DashboardIcon />}
						style={ styles.listItem(pathname === "/") }
						containerElement={ <Link to="/" /> }
					/>
					<ListItem
						primaryText="View Majors"
						leftIcon={<SchoolIcon />}
						style={ styles.listItem(pathname === "/majors") }
						containerElement={ <Link to="/majors" /> }
					/>
					<ListItem
						primaryText="Courses"
						leftIcon={<FolderIcon />}
						initiallyOpen={false}
						primaryTogglesNestedList={true}
						nestedItems={[
							<ListItem
								className="sidebar-courses"
								key={1}
								primaryText="My Courses"
								style={ styles.listItem(pathname === "/my-courses") }
								containerElement={ <Link to="/my-courses" /> }
								leftIcon={<MyCoursesIcon />}
							/>,
							<ListItem
								className="sidebar-courses"
								key={2}
								primaryText="My Schedule"
								style={ styles.listItem(pathname === "/schedule") }
								containerElement={ <Link to="/schedule" /> }
								leftIcon={<ScheduleIcon />}
							/>,
						]}
					/>
				</List>
			</Drawer>
		);
	}
}

const mapStateToProps = ({ isLoggedIn, user }) => {
  const { name, profileURL } = user;
  return { isLoggedIn, name, profileURL };
};

export default withRouter(connect(mapStateToProps, null)(SideBarContainer));
