import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ChooseBoard from './ChooseBoard';
import SelectScreen from './SelectScreen';

const styles = {
  header: {
    display: 'flex',
    paddingLeft: 30,
  },
  select: {
    width: 200,
    marginRight: 50,
    textAlign: 'left',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: 70
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
  const response = await fetch(`/majors/get/${key}`);
  if (!response.ok) return { data: [], name: '', url: '' };
  const data = await response.json() || { data: [], name: '', url: '' };
  return data;
}

async function fetchList() {
  const response = await fetch('/majors/list');
  if (!response.ok) return;
  return await response.json();
}

// Returns true if major is a major in the provided list
const isMajor = (major, list) => {
  if (!major) return false;
  list.forEach(({ key }) => {
    if (key === major) return true
  });
  return false;
}

class MajorsContainer extends Component {
  static propTypes: {
    myCourses: PropTypes.object.isRequired,
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
    const { majorsList, key } = this.state;

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
        <div>
          <div style={ styles.header }>
            <SelectField
              floatingLabelText="Choose a major"
              onChange={ this.handleChange.bind(this) }
              style={ styles.select }
              value={ key }
              autoWidth
            >
              {
                majorsList.map(({ key, name }, index) => (
                  <MenuItem key={ index } value={ key } primaryText={ name } />
                ))
              }
            </SelectField>
            <h1><a href={ this.state.url } target="_blank">{ this.state.name }</a></h1>
          </div>
          <div style={ styles.container }>
            { this.state.reqs.map((req, index) => renderReqNode(req, index, this.props.myCourses)) }
          </div>
        </div>
     );
    }
  }
}

const mapStateToProps = ({ myCourses }) => ({ myCourses });

export default connect(mapStateToProps)(MajorsContainer);
