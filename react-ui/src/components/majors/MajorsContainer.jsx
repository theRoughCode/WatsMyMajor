import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ChooseBoard from './ChooseBoard';
import SelectScreen from './SelectScreen';
import MajorsAppBar from './MajorsAppBar';
import { fireLoginPrompt } from '../tools/LoginPrompt';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    paddingLeft: 30,
  },
  select: {
    width: 200,
    marginRight: 50,
    textAlign: 'left',
  },
  body: {
    width: 'calc(100% - 15px)',
		height: '100%',
	  display: 'flex',
    flexWrap: 'wrap',
		overflowX: 'hidden',
    paddingLeft: 15,
  },
};

const renderReqNode = ({ type, choose, courses }, index, myCourses) => {
  switch (type) {
    case "choose":
      return (
        <ChooseBoard
          key={ index }
          choose={ choose }
          title={ `Choose ${choose} of:` }
          courses={ courses }
          myCourses={ myCourses }
        />
      );
    case "all":
      return (
        <ChooseBoard
          key={ index }
          choose={ courses.length }
          title="Choose all of:"
          courses={ courses }
          myCourses={ myCourses }
        />
      );
    default: return null;
  }
};

async function fetchRequirements(key) {
  const response = await fetch(`/server/majors/get/${key}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) return { data: [], name: '', url: '' };
  const data = await response.json() || { data: [], name: '', url: '' };
  return data;
}

async function fetchList() {
  const response = await fetch('/server/majors/list', {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) return;
  return await response.json();
}

class MajorsContainer extends Component {
  static propTypes: {
    myCourses: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  };

  state = {
    majorsList: [],
    key: '',
    name: '',
    url: '',
    reqs: [],
  };

  async componentDidMount() {
    const majorsList = await fetchList() || [];
    const { majorKey } = this.props.match.params;
    this.updateMajors(majorKey, majorsList);
    this.setState({ majorsList });
  }

  componentWillReceiveProps(nextProps) {
    const { majorKey } = nextProps.match.params;
    if (majorKey !== this.props.match.params.majorKey) {
      this.updateMajors(majorKey, this.state.majorsList);
    }
  }

  // Update selected major
  async updateMajors(majorKey, majorsList) {
    if (majorKey == null) return;
    if (majorKey === this.state.key) return;

    for (let i = 0; i < majorsList.length; i++) {
      const { key, name } = majorsList[i];
      if (key === majorKey) {
        const { data, url } = await fetchRequirements(key);
        this.setState({ key, name, reqs: data, url });
        return;
      }
    }
  }

  // Handle selection of menu item
  async handleChange(_, index, key) {
    const { data, url } = await fetchRequirements(key);
    this.props.history.push(`/majors/${key}`);
    this.setState({ key, name: this.state.majorsList[index].name, reqs: data, url });
  }

  render() {
    const { majorsList, name, key, url } = this.state;
    const { isLoggedIn, history, location } = this.props;

    // Notify non-loggedin users that they should login first.
    if (!isLoggedIn) fireLoginPrompt(history, location.pathname, 'Log in to save your selections!');

    if (key.length === 0) {
      return (
        <SelectScreen
          handleChange={ this.handleChange.bind(this) }
          majorsList={ majorsList }
          value={ key }
        />
      );
    } else {
      return (
        <div style={ styles.container }>
          <MajorsAppBar
            majorName={ name }
            majorKey={ key }
            url={ url }
            majorsList={ majorsList }
            onChange={ this.handleChange.bind(this) }
          />
          <div style={ styles.body }>
            { this.state.reqs.map((req, index) => renderReqNode(req, index, this.props.myCourses)) }
          </div>
        </div>
     );
    }
  }
}

const mapStateToProps = ({ myCourses, isLoggedIn }) => ({ myCourses, isLoggedIn });

export default connect(mapStateToProps)(MajorsContainer);
