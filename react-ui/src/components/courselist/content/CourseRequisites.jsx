import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { hasTakenCourse } from 'utils/courses';
import ChooseReqs from './ChooseReqs';
import { green, mustard, purple } from 'constants/Colours';

const styles = {
  container: {
    margin: 'auto',
    marginTop: 20,
    width: 300,
    maxWidth: '100%',
    height: '90%',
  },
  tabHeader: {
    backgroundColor: purple,
  },
  bar: {
    backgroundColor: mustard,
  },
  headline: {
    fontSize: 13,
    paddingTop: 2,
    marginBottom: 2,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  reqs: (isSelected) => ({
    width: '100%',
    color: (isSelected) ? green : 'inherit',
    textDecoration: 'none',
    padding: 1,
    paddingLeft: 10,
    textAlign: 'left',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
};

class CourseRequisites extends Component {

  static propTypes = {
    antireqs: PropTypes.array.isRequired,
    coreqs: PropTypes.array.isRequired,
    prereqs: PropTypes.object.isRequired,
    postreqs: PropTypes.array.isRequired,
    myCourses: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const {
      antireqs,
      coreqs,
      prereqs,
      postreqs
    } = this.props;

    this.state = {
      slideIndex: 0,
      prereqs: this.formatReqs(prereqs),
      coreqs: coreqs.map(this.formatReqs),
      antireqs: antireqs.map(this.formatReqs),
      postreqs: postreqs.map(this.formatReqs),
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  formatCourseReq = (course, index) => {
    if (typeof course === "string") return course;

    const { myCourses } = this.props;
    const { subject, catalogNumber, title } = course;
    const hasTaken = hasTakenCourse(subject, catalogNumber, myCourses);

    return (
      <a
        key={ index }
        className="reqs-link"
        href={ `/courses/${subject}/${catalogNumber}` }
        style={ styles.reqs(hasTaken) }
      >
        { `${subject} ${catalogNumber}` }
        { hasTakenCourse(subject, catalogNumber, myCourses) ? ' ✔' : '' }
        <span style={{ fontSize: 12 }}>&ensp;<i>{ title }</i></span>
      </a>
    )
  }

  formatReqs = (requisites, index) => {
    if (!Object.keys(requisites).length) return [];
    // Base case: list of courses
    if (requisites.hasOwnProperty('subject')) {
      return this.formatCourseReq(requisites, index);
    }
    if (typeof requisites === 'string') return requisites;

    // Inductive case: list of courses with choose
    switch (requisites.choose) {
    case 0: return requisites.reqs.map(this.formatReqs);
    default: {
      if (requisites.reqs == null) return [];
      const newReqsArr = requisites.reqs.map(this.formatReqs);
      return [
        <ChooseReqs
          key={ 0 }
          choose={ requisites.choose }
          reqs={ newReqsArr }
        />
      ];
    }
    }
  };

  render() {
    const {
      antireqs,
      coreqs,
      prereqs,
      postreqs
    } = this.state;

    const titles = [ 'Prereqs', 'Antireqs', 'Coreqs', 'Postreqs' ];
    const reqs = [ prereqs, antireqs, coreqs, postreqs ];

    return (
      <div style={ styles.container }>
        <Paper zDepth={ 1 }>
          <Tabs
            onChange={ this.handleChange }
            value={ this.state.slideIndex }
            tabItemContainerStyle={ styles.tabHeader }
            inkBarStyle={ styles.bar }
          >
            {
              titles
                .filter((title, index) => (!Array.isArray(reqs[index]) &&
                  Object.keys(reqs[index]).length) || reqs[index].length)
                .map((title, index) => (
                  <Tab
                    key={ index }
                    label={ title }
                    value={ index }
                    style={ styles.headline }
                  />
                ))
            }
          </Tabs>
          <SwipeableViews
            index={ this.state.slideIndex }
            onChangeIndex={ this.handleChange }
          >
            {
              reqs
                .filter(req => req.length)
                .map((req, index) => (
                  <div key={ index } style={ styles.slide }>
                    { req }
                  </div>
                ))
            }
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = ({ myCourses }) => ({ myCourses });

export default connect(mapStateToProps, null)(CourseRequisites);
