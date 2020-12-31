import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
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
  },
};

const renderReqNode = ({ type, choose, courses }, index, myCourses) => {
  switch (type) {
    case 'choose':
      return (
        <ChooseBoard
          key={index}
          choose={choose}
          title={`Choose ${choose} of:`}
          courses={courses}
          myCourses={myCourses}
        />
      );
    case 'all':
      return (
        <ChooseBoard
          key={index}
          choose={0}
          title="Choose all of:"
          courses={courses}
          myCourses={myCourses}
        />
      );
    default:
      return null;
  }
};

renderReqNode.propTypes = {
  type: PropTypes.string,
  choose: PropTypes.number,
  courses: PropTypes.array,
};

renderReqNode.defaultProps = {
  type: '',
  choose: 0,
  courses: [],
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
  Object.keys(courses).forEach((subject) =>
    Object.keys(courses[subject]).forEach(
      (catalogNumber) => (courses[subject][catalogNumber] = false)
    )
  );
  return reqs.map((req, index) => renderReqNode(req, index, courses));
};

async function fetchRequirements(faculty, key) {
  const response = await fetch(`/server/majors/get/${faculty}/${key}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  if (!response.ok) return { data: [], name: '', url: '' };
  const data = (await response.json()) || { data: [], name: '', url: '' };
  return data;
}

async function fetchList() {
  const response = await fetch('/server/majors/list', {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  if (!response.ok) return;
  return response.json();
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
    key: '', // key for selected major
    name: '', // name of selected major
    url: '', // url of selected major
    reqs: [],
    core: [], // list of faculty core courses
  };

  async componentDidMount() {
    const majorsList = (await fetchList()) || [];
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
        key: '', // key for selected major
        name: '', // name of selected major
        url: '', // url of selected major
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
    let { data, url, ignoreCore } = await fetchRequirements(faculty, majorKey);
    let core = [];
    if (!ignoreCore) {
      const coreReqs = await fetchRequirements(faculty, 'core');
      core = coreReqs.data;
    }
    this.setState({
      key: majorKey,
      faculty,
      core,
      name,
      reqs: data,
      url,
    });
  }

  // Handle selection of major
  handleMajorChange = async (_, index, key) => {
    if (key !== this.state.key) this.props.history.push(`/majors/${this.state.faculty}/${key}`);
  };

  // Handle selection of faculty
  handleFacultyChange = async (_, index, key) => {
    if (key !== this.state.faculty) this.setState({ faculty: key });
  };

  render() {
    const { majorsList, name, faculty, key, url, reqs, core } = this.state;
    const { history, location } = this.props;

    setTimeout(() => {
      // Notify non-loggedin users that they should login first.
      if (!this.props.isLoggedIn) {
        fireLoginPrompt(history, location.pathname, 'Log in to save your selections!');
      }
    }, 1500);

    if (key.length === 0) {
      return (
        <SelectScreen
          handleMajorChange={this.handleMajorChange}
          handleFacultyChange={this.handleFacultyChange}
          majorsList={majorsList}
          faculty={faculty}
          major={key}
        />
      );
    } else {
      return (
        <div style={styles.container}>
          <Helmet>
            <title>View Majors - WatsMyMajor</title>
            <meta
              name="description"
              content="WatsMyMajor is a course planning app for University of Waterloo (UW) students.
            This app aims to help plan out your courses and majors, whether you're in Computer Science, Engineering, or Arts."
            />
            <meta name="keywords" content="majors, minors, options, uw, uwaterloo, watsmymajor" />
            <meta property="og:url" content="https://www.watsmymajor.com/majors" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Plan Out Your Courses And Majors | WatsMyMajor" />
            <meta
              property="og:description"
              content="Need help choosing courses or determining which major to take?  WatsMyMajor makes it all super easy by automating the process!"
            />
            <meta
              property="og:image"
              content="https://user-images.githubusercontent.com/19257435/42982669-3b1a569c-8b97-11e8-9e99-d15c3de11cf8.png"
            />
          </Helmet>
          <MajorsAppBar
            majorName={name}
            majorKey={key}
            url={url}
            faculty={faculty}
            majorsList={majorsList}
            handleMajorChange={this.handleMajorChange}
            handleFacultyChange={this.handleFacultyChange}
          />
          <div style={styles.body}>
            {key !== 'core' && core.length > 0 && (
              <div style={styles.reqsContainer}>
                <span style={styles.reqsHeading}>Faculty Core Courses</span>
                <div style={styles.reqsSubContainer}>
                  {renderRequisites(core, this.props.myCourses)}
                </div>
              </div>
            )}
            <div style={styles.reqsContainer}>
              <span style={styles.reqsHeading}>Program Courses</span>
              <div style={styles.reqsSubContainer}>
                {renderRequisites(reqs, this.props.myCourses)}
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
