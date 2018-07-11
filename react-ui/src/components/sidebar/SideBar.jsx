import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import SchoolIcon from 'material-ui/svg-icons/social/school';
import MyCoursesIcon from 'material-ui/svg-icons/social/person';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import BrowseIcon from 'material-ui/svg-icons/action/subject';
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

class SideBar extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		isLoggedIn: PropTypes.bool.isRequired,
		open: PropTypes.bool.isRequired,
		location: PropTypes.object.isRequired, // router
	};

	state = {
		pathname: this.props.location.pathname
	};

	componentWillReceiveProps(nextProps) {
	  if (nextProps.location.pathname !== this.state.pathname) {
			this.setState({ pathname: nextProps.location.pathname });
		}
	}

	// TODO: Figure out a better way.  Maybe check why location.pathname is not
	// being updated when clicking on listitem
	handleClick(pathname) {
		this.setState({ pathname });
	}

	render() {
		const { name, isLoggedIn, open } = this.props;
		const { pathname } = this.state;

		return (
			<Drawer open={ open } style={ styles.drawer }>
				<MenuItem
					style={ styles.avatarMenuItem }
					>
					{ isLoggedIn && <Avatar name={ name } /> }
				</MenuItem>
				<List>
					<ListItem
						primaryText="Dashboard"
						leftIcon={<DashboardIcon />}
						style={ styles.listItem(pathname === "/") }
						onClick={ this.handleClick.bind(this, "/") }
						containerElement={ <Link to="/" /> }
					/>
					<ListItem
						primaryText="Courses"
						leftIcon={<SchoolIcon />}
						initiallyOpen={false}
						primaryTogglesNestedList={true}
						nestedItems={[
							<ListItem
								className="sidebar-courses"
								key={1}
								primaryText="My Courses"
								style={ styles.listItem(pathname === "/my-courses") }
								onClick={ this.handleClick.bind(this, "/my-courses") }
								containerElement={ <Link to="/my-courses" /> }
								leftIcon={<MyCoursesIcon />}
							/>,
							<ListItem
								className="sidebar-courses"
								key={2}
								primaryText="My Schedule"
								style={ styles.listItem(pathname === "/schedule") }
								onClick={ this.handleClick.bind(this, "/schedule") }
								containerElement={ <Link to="/schedule" /> }
								leftIcon={<ScheduleIcon />}
							/>,
							<ListItem
								className="sidebar-courses"
								key={3}
								primaryText="Browse Courses"
								style={ styles.listItem(pathname === "/courses") }
								onClick={ this.handleClick.bind(this, "/courses") }
								containerElement={ <Link to="/courses" /> }
								leftIcon={<BrowseIcon />}
							/>
						]}
					/>
				</List>
			</Drawer>
		);
	}
}

export default withRouter(SideBar);
