import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import CourseHeader from './CourseHeader';
import CourseDescription from './CourseDescription';
import CourseClassList from './CourseClassList';
import CourseRequisites from './CourseRequisites';

const styles = {
  courseContent: {
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '20px 40px',
  },
  bodyContainer: {
    display: 'flex',
    marginTop: 25,
    width: '100%',
  },
  rightContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginRight: 20,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
    marginTop: 0,
  },
  treeButton: {
    width: '100%'
  },
}

const CourseContent = ({
  subject,
  catalogNumber,
  course,
  term,
  classes,
  expandClass,
  taken,
  inCart,
  eligible,
  addToCartHandler,
  removeFromCartHandler,
}) => {
  const {
    title,
    description,
    rating,
    url,
    // notes,
    // units,
    terms,
    crosslistings,
    antireqs,
    coreqs,
    prereqs,
    postreqs,
  } = course;

  return (
    <div style={ styles.courseContent }>
      <CourseHeader
        subject={ subject }
        catalogNumber={ catalogNumber }
        title={ title }
        rating={ rating }
        url={ url }
        terms={ terms }
        addToCartHandler={ addToCartHandler }
        removeFromCartHandler={ removeFromCartHandler }
        taken={ taken }
        inCart={ inCart }
        eligible={ eligible }
      />
      <div style={ styles.bodyContainer }>
        <div style={ styles.rightContainer }>
          <CourseDescription
            subject={ subject }
            catalogNumber={ catalogNumber }
            description={ description }
            crosslistings={ crosslistings }
            antireqs={ antireqs }
            coreqs={ coreqs }
            prereqs={ prereqs }
            postreqs={ postreqs }
          />
          {
            classes.length > 0 && (
              <CourseClassList
                expandClass={ expandClass }
                term={ term }
                classes={ classes }
              />
            )
          }
        </div>
        <div style={ styles.leftContainer }>
          {
            Object.keys(prereqs).length > 0 && (
              <Link to={ `/courses/${subject}/${catalogNumber}/tree/prereqs` }>
                <RaisedButton
                  label="View Requisites Tree"
                  style={ styles.treeButton }
                />
              </Link>
            )
          }
          <CourseRequisites
            antireqs={ antireqs }
            coreqs={ coreqs }
            prereqs={ prereqs }
            postreqs={ postreqs }
          />
        </div>
      </div>
    </div>
  );
};

CourseContent.propTypes = {
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  course: PropTypes.object.isRequired,
  term: PropTypes.string.isRequired,
  classes: PropTypes.array.isRequired,
  expandClass: PropTypes.func.isRequired,
  taken: PropTypes.bool.isRequired,
  inCart: PropTypes.bool.isRequired,
  eligible: PropTypes.bool.isRequired,
  addToCartHandler: PropTypes.func.isRequired,
  removeFromCartHandler: PropTypes.func.isRequired,
}

export default CourseContent;
