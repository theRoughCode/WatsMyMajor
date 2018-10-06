import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import Paper from 'material-ui/Paper';
import PopularCourseGraph from './PopularCourseGraph';
import UserCoursesGraph from './UserCoursesGraph';
import Watchlist from './Watchlist';
import { unwatchClass } from '../../actions';
import { white } from '../../constants/Colours';

const styles = {
  container: {
    marginBottom: 20,
  },
  header: {
    backgroundColor: white,
    paddingLeft: 20,
    color: 'black',
    display: 'flex',
  },
  headerText: (isMobile) => ({
    fontSize: (isMobile) ? 17 : 25,
    fontWeight: 500,
  }),
  graphContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 20,
  },
};

const Dashboard = ({
  name,
  username,
  myCourses,
  watchlist,
  history,
  onUnwatchClass,
}) => (
  <MediaQuery minWidth={ 700 }>
    { matches => (
      <div style={ styles.container }>
        <Paper style={ styles.header }>
          <h2 style={ styles.headerText(!matches) }>Welcome to WatsMyMajor, { name }!</h2>
        </Paper>
        <div style={ styles.graphContainer }>
          <PopularCourseGraph />
          <UserCoursesGraph myCourses={ myCourses } />
        </div>
        <Watchlist
          watchlist={ watchlist }
          history={ history }
          onUnwatch={ (term, classNum) => onUnwatchClass(username, term, classNum) }
        />
      </div>
    ) }
  </MediaQuery>
);

Dashboard.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  myCourses: PropTypes.object.isRequired,
  watchlist: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onUnwatchClass: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user, myCourses, watchlist }) => ({
  name: user.name,
  username: user.username,
  myCourses,
  watchlist,
});

const mapDispatchToProps = dispatch => ({
  onUnwatchClass: (username, term, classNum) => dispatch(unwatchClass(username, term, classNum)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
