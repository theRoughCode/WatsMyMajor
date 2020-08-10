import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import Divider from '@material-ui/core/Divider';

const styles = {
  container: {
    maxWidth: 360,
    margin: 'auto 10px',
  },
  innerContainer: {
    margin: 'auto',
    paddingTop: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 500,
  },
  subheader: {
    float: 'left',
  },
};

const getProfNames = async (list) => {
  if (list.length === 0) return [];
  try {
    const response = await fetch(`/server/prof/names`, {
      method: 'POST',
      body: JSON.stringify(list),
      headers: {
        'content-type': 'application/json',
        'x-secret': process.env.REACT_APP_SERVER_SECRET,
      },
    });

    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getCourseList = (courses) => {
  if (courses == null) return [];
  const courseList = [];
  Object.keys(courses).forEach((subject) => {
    Object.keys(courses[subject]).forEach((catalogNumber) => {
      courseList.push({ subject, catalogNumber });
    });
  });
  return courseList;
};

export default class Reviews extends Component {
  static propTypes = {
    courses: PropTypes.object,
    profs: PropTypes.object,
  };

  static defaultProps = {
    courses: {},
    profs: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      profs: [],
      courses: [],
    };
  }

  async componentDidMount() {
    let { courses, profs } = this.props;
    profs = await getProfNames(profs);
    this.setState({ courses: getCourseList(courses), profs: profs || [] });
  }

  render() {
    const { courses, profs } = this.state;
    if (courses.length === 0 && profs.length === 0) return null;

    return (
      <div style={styles.container}>
        <Paper style={styles.innerContainer}>
          <span style={styles.header}>My Reviews</span>
          {courses.length > 0 && (
            <List subheader={<ListSubheader style={styles.subheader}>Courses</ListSubheader>}>
              {courses.map(({ subject, catalogNumber }) => (
                <ListItem
                  key={subject + catalogNumber}
                  button
                  component="a"
                  href={`/courses/${subject}/${catalogNumber}`}
                >
                  <ListItemText primary={`${subject} ${catalogNumber}`} />
                </ListItem>
              ))}
            </List>
          )}
          {profs.length && (
            <List subheader={<ListSubheader style={styles.subheader}>Professors</ListSubheader>}>
              {profs.map(({ name, id }) => (
                <ListItem key={id} button component="a" href={`/professors/${id}`}>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </div>
    );
  }
}
