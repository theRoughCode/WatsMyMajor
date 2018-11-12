import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    flexDirection: 'column',
    paddingLeft: 15,
  },
  reqsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
  },
  reqsHeading: {
    fontSize: 23,
    textAlign: 'left',
    margin: 'auto',
    marginLeft: 20,
  },
  reqsSubContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
  }
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
        choose={ 0 }
        title="Choose all of:"
        courses={ courses }
        myCourses={ myCourses }
      />
    );
  default: return null;
  }
};

// Renders requisite nodes
// NOTE: Requisites are "taken" in order.  So, if a course falls under multiple
// boards, only the first one will take it.
// Have to take: CourseCheck, OptionCheck
// WARNING: If a choose one has mutliple possible fulfilled items, they all are
// marked as taken. This would not allow other requirements to use any of them,
// which is not the correct intended behaviour.
const renderRequisites = (reqs, myCourses) => {
  // Make a copy so we don't change the original
  const courses = Object.assign({}, myCourses);
  // Remove prereqs array and set to false instead
  // TODO: Remove this once myCourses is revamped
  Object.keys(courses).map(subject =>
    Object.keys(courses[subject]).map(catalogNumber =>
      courses[subject][catalogNumber] = false
    )
  );
  return reqs.map((req, index) => renderReqNode(req, index, courses))
};

async function fetchRequirements(faculty, key) {
  const response = await fetch(`/server/majors/get/${faculty}/${key}`, {
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
  static propTypes = {
    myCourses: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  state = {
    majorsList: {},
    faculty: '',
    key: '',  // key for selected major
    name: '', // name of selected major
    url: '',  // url of selected major
    reqs: [],
    core: [], // list of faculty core courses
  };

  async componentDidMount() {
    const majorsList = await fetchList() || [];
    const { faculty, majorKey } = this.props.match.params;
    this.updateMajors(faculty, majorKey, majorsList);
    this.setState({ majorsList });
  }

  componentWillReceiveProps(nextProps) {
    const { faculty, majorKey } = nextProps.match.params;
    if (majorKey !== this.props.match.params.majorKey) {
      this.updateMajors(faculty, majorKey, this.state.majorsList);
    }
  }

  // Update selected major
  async updateMajors(faculty, majorKey, majorsList) {
    if (faculty == null && majorKey == null) {
      this.setState({
        faculty: '',
        key: '',  // key for selected major
        name: '', // name of selected major
        url: '',  // url of selected major
        reqs: [],
        core: [], // list of faculty core courses
      });
      return;
    }
    if (faculty == null || majorKey == null) return;
    if (majorKey === this.state.key) return;
    if (!majorsList.hasOwnProperty(faculty)) return;

    const name = majorsList[faculty].majors[majorKey];
    document.title = `${name} Major | University of Waterloo - WatsMyMajor`;
    const { data, url } = await fetchRequirements(faculty, majorKey);
    const core = await fetchRequirements(faculty, 'core');
    this.setState({
      key: majorKey,
      faculty,
      core: core.data,
      name,
      reqs: data,
      url,
    });
  }

  // Handle selection of major
  handleMajorChange = async (_, index, key) => {
    if (key !== this.state.key) this.props.history.push(`/majors/${this.state.faculty}/${key}`);
  }

  // Handle selection of faculty
  handleFacultyChange = async(_, index, key) => {
    if (key !== this.state.faculty) this.setState({ faculty: key });
  }

  render() {
    const { majorsList, name, faculty, key, url, reqs, core } = this.state;
    const { isLoggedIn, history, location } = this.props;

    // Notify non-loggedin users that they should login first.
    if (!isLoggedIn) fireLoginPrompt(history, location.pathname, 'Log in to save your selections!');

    if (key.length === 0) {
      return (
        <SelectScreen
          handleMajorChange={ this.handleMajorChange }
          handleFacultyChange={ this.handleFacultyChange }
          majorsList={ majorsList }
          faculty={ faculty }
          major={ key }
        />
      );
    } else {
      return (
        <div style={ styles.container }>
          <MajorsAppBar
            majorName={ name }
            majorKey={ key }
            url={ url }
            faculty={ faculty }
            majorsList={ majorsList }
            handleMajorChange={ this.handleMajorChange }
            handleFacultyChange={ this.handleFacultyChange }
          />
          <div style={ styles.body }>
            {
              (key !== 'core' && core.length > 0) && (
                <div style={ styles.reqsContainer }>
                  <span style={ styles.reqsHeading }>Faculty Core Courses</span>
                  <div style={ styles.reqsSubContainer }>
                    { renderRequisites(core, this.props.myCourses) }
                  </div>
                </div>
              )
            }
            <div style={ styles.reqsContainer }>
              <span style={ styles.reqsHeading }>Program Courses</span>
              <div style={ styles.reqsSubContainer }>
                { renderRequisites(reqs, this.props.myCourses) }
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = ({ myCourses, isLoggedIn }) => ({ myCourses, isLoggedIn });

export default connect(mapStateToProps)(MajorsContainer);
