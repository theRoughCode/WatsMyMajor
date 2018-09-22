import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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

const LinkItem = ({ primaryText, icon, path, onClick, isSelected }) => {
  const text = <span>{ primaryText }</span>;
  const onItemClick = () => onClick(`/${path}`);
  return (
    <ListItem
      primaryText={ text }
      leftIcon={ icon }
      style={ styles.listItem(isSelected) }
      onClick={ onItemClick }
    />
  );
};

LinkItem.propTypes = {
  primaryText: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
}

class SideBarContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    profileURL: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired, // router
    history: PropTypes.object.isRequired,
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
          <LinkItem
            primaryText="Dashboard"
            path=""
            icon={ <DashboardIcon color={ white } /> }
            isSelected={ (pathname === "/") }
            onClick={ this.onNavClick }
          />
          <LinkItem
            primaryText="View Majors"
            path="majors"
            icon={ <SchoolIcon color={ white } /> }
            isSelected={ (pathname === "/majors") }
            onClick={ this.onNavClick }
          />
          <LinkItem
            primaryText="My Courses"
            path="my-courses"
            icon={ <MyCoursesIcon color={ white } /> }
            isSelected={ (pathname === "/my-courses") }
            onClick={ this.onNavClick }
          />
          <LinkItem
            primaryText="My Schedule"
            path="schedule"
            icon={ <ScheduleIcon color={ white } /> }
            isSelected={ (pathname === "/schedule") }
            onClick={ this.onNavClick }
          />
        </List>
        <div style={ styles.github }>
          <div style={ styles.githubTextContainer }>
            <a style={{ color: 'white', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" href="https://github.com/theRoughCode/watsmymajor/issues">
              <span>Found an issue?</span>
              <GithubIcon style={ styles.githubIcon } />
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
