import React, { Component } from 'react';
import PropTypes from 'prop-types';
const moment = require('moment');

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    paddingBottom: 3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'none',
  },
  title: {
    fontWeight: 500,
    marginTop: 3
  },
  text: {
    marginTop: 6
  }
}

export default class Event extends Component {
  static propTypes = {
    start: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    style: PropTypes.object,
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    // classNum: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    instructor: PropTypes.string.isRequired
  };

  static defaultProps = {
    style: {}
  }

  render() {
    const {
      start,
      end,
      style,
      onClick,
      title,
      type,
      // classNum,
      section,
      location,
      instructor
    } = this.props;

    const startTime = moment(start).format('h:mmA');
    const endTime = moment(end).format('h:mmA');

    return (
      <div
        onClick={ onClick }
        style={ style }
      >
        <div style={ styles.container }>
          <span style={ styles.title }>{ `${title} - ${type} ${section}` }</span>
          <span style={ styles.text }>{ `${startTime} - ${endTime}` }</span>
          <span style={ styles.text }>{ instructor }</span>
          <span style={ styles.text }>{ location }</span>
        </div>
      </div>
    )
  }
}
