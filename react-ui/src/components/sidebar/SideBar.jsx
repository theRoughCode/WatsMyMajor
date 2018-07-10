import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
	}
}

const SideBar = ({ name, isLoggedIn, open }) => (
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
						containerElement={ <Link to="/my-courses" /> }
						leftIcon={<MyCoursesIcon />}
					/>,
					<ListItem
						className="sidebar-courses"
						key={2}
						primaryText="My Schedule"
						containerElement={ <Link to="/schedule" /> }
						leftIcon={<ScheduleIcon />}
					/>,
					<ListItem
						className="sidebar-courses"
						key={3}
						primaryText="Browse Courses"
						containerElement={ <Link to="/courses" /> }
						leftIcon={<BrowseIcon />}
					/>
				]}
			/>
		</List>
	</Drawer>
);

SideBar.propTypes = {
	name: PropTypes.string.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	open: PropTypes.bool.isRequired
};

export default SideBar;
