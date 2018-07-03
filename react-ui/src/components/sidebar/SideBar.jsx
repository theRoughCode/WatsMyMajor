import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SchoolIcon from '@material-ui/icons/School';
import MyCoursesIcon from '@material-ui/icons/Person';
import ScheduleIcon from '@material-ui/icons/Schedule';
import BrowseIcon from '@material-ui/icons/Subject';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Avatar from './Avatar';

export default class SideBar extends Component {

	static propTypes = {
		username: PropTypes.string,
		sideBarOpen: PropTypes.bool.isRequired,
		classes: PropTypes.object.isRequired
	};

 	static defaultProps = {
		username: "",
		classes: {}
	};

	constructor(props) {
		super(props);

		this.state = {
			dropDownOpen: true
		};

		this.toggleDropDown = this.toggleDropDown.bind(this);
	}

	toggleDropDown() {
		this.setState({ dropDownOpen: !this.state.dropDownOpen });
	}

	render() {
		const { username, sideBarOpen, classes } = this.props;

		return (
			<Drawer
				variant="persistent"
				anchor="left"
				open={sideBarOpen}
				classes={{
					paper: classes.drawer
				}}
			>
				<ListItem
					button
					classes={{
						root: classes.avatar,
						button: classes.avatarButton
					}}
				>
					<Avatar name={ username } />
				</ListItem>
				<List>
					<Link to="/" className={classes.link}>
						<ListItem button>
							<ListItemIcon>
								<DashboardIcon />
							</ListItemIcon>
							<ListItemText inset primary="Dashboard" />
						</ListItem>
					</Link>
					<ListItem button onClick={this.toggleDropDown}>
						<ListItemIcon>
							<SchoolIcon />
						</ListItemIcon>
						<ListItemText inset primary="Courses" />
					  {this.state.dropDownOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={this.state.dropDownOpen} timeout="auto" unmountOnExit>
						<List>
							<Link to="/my-courses" className={classes.link}>
								<ListItem button className={classes.nested}>
									<ListItemIcon>
										<MyCoursesIcon />
									</ListItemIcon>
									<ListItemText inset primary="My Courses" />
								</ListItem>
							</Link>
							<Link to="/schedule" className={classes.link}>
								<ListItem button className={classes.nested}>
									<ListItemIcon>
										<ScheduleIcon />
									</ListItemIcon>
									<ListItemText inset primary="My Schedule" />
								</ListItem>
							</Link>
							<Link to="/courses" className={classes.link}>
								<ListItem button className={classes.nested}>
									<ListItemIcon>
										<BrowseIcon />
									</ListItemIcon>
									<ListItemText inset primary="Browse Courses" />
								</ListItem>
							</Link>
						</List>
					</Collapse>
				</List>
			</Drawer>
		);
	}
}
