import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import {
  yellow,
  lightGreen,
  whiteGrey,
} from 'constants/Colours';

const space = 8;
const styles = {
  container: (highlightBackground) => ({
    background: (highlightBackground) ? lightGreen : 'inherit',
  }),
};

const getItemStyle = (isDragging, isPrereq, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: space,
  margin: `0 0 ${space}px 0`,
  border: (isDragging || isPrereq)
    ? '1px solid #4f4f4f'
    : '1px solid #bcbcbc',

  // change background colour if dragging
  background: isDragging
    ? '#8be58b'
    : isPrereq
      ? yellow
      : whiteGrey,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const isInPrereqs = (subject, catalogNumber, prereqs) => {
  for (var i = 0; i < prereqs.length; i++) {
    if (subject === prereqs[i].subject && catalogNumber === prereqs[i].catalogNumber) {
      return true;
    }
  }
  return false;
}

const CourseCard = ({
  course,
  courseCardPrereqs,
  provided,
  snapshot,
  highlightBackground,
  history
}) => {
  const { subject, catalogNumber, title } = course;

  // Mark this card as selected if is a prereq of dragged card
  const isPrereq = isInPrereqs(subject, catalogNumber, courseCardPrereqs);

  return (
    <Link to={ `/courses/${subject}/${catalogNumber}` } target="_blank" style={{ textDecoration: 'none' }}>
      <Paper
        zDepth={ 1 }
        style={ styles.container(highlightBackground) }
      >
        <div
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
          style={ getItemStyle(
            snapshot.isDragging,
            isPrereq,
            provided.draggableProps.style,
            highlightBackground,
          ) }
          data-tip={ title }
          data-for="course-card-title"
        >
          { `${subject} ${catalogNumber}` }
        </div>
      </Paper>
    </Link>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  highlightBackground: PropTypes.bool.isRequired,

  // Redux
  courseCardPrereqs: PropTypes.array.isRequired,

  // DnD
  provided: PropTypes.object.isRequired,
  snapshot: PropTypes.object.isRequired,
};

const mapStateToProps = ({ courseCardPrereqs }) => ({ courseCardPrereqs });

export default withRouter(connect(mapStateToProps, null)(CourseCard));
