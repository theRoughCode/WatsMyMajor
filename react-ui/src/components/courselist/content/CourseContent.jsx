import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import RaisedButton from 'material-ui/RaisedButton';
import CourseHeader from './CourseHeader';
import CourseDescription from './CourseDescription';
import CourseClassList from './CourseClassList';
import CourseRequisites from './CourseRequisites';

const styles = {
  courseContent: (isMobile) => {
    const horPadding = (isMobile) ? 15 : 40;
    return {
      width: `calc(100% - ${horPadding * 2}px)`,
      height: 'calc(100% - 40px)',
      display: 'flex',
      flexWrap: 'wrap',
      padding: `20px ${horPadding}px`,
    };
  },
  bodyContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 25,
    width: '100%',
  },
  rightContainer: {
    display: 'flex',
    maxWidth: '100%',
    flex: 1,
    flexDirection: 'column',
    marginRight: 20,
    marginBottom: 30,
  },
  leftContainer: (isMobile) => ({
    display: 'flex',
    maxWidth: '100%',
    flexDirection: 'column',
    margin: (isMobile) ? 'auto' : 20,
    marginTop: 0,
    marginBottom: 20,
  }),
  treeButton: {
    width: '100%'
  },
  fbLikeContainer: {
    overflow: 'hidden',
    marginTop: 20,
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

  // Update the share button
  setTimeout(() => {
    if (window.FB) window.FB.XFBML.parse();
  }, 500);

  const pageTitle = `${subject} ${catalogNumber} - ${title} | University of Waterloo - WatsMyMajor`;
  const pageDescription = `${subject} ${catalogNumber} - ${title}: ${description}`;
  const pageKeywords = ['uw', 'uwaterloo', 'waterloo', 'course', subject, catalogNumber, `${subject} ${catalogNumber}`,
    `${subject+catalogNumber}`, `${title}`, ...title.split(' ')].join(', ');

  return (
    <MediaQuery minWidth={ 400 }>
      { matches => (
        <div style={ styles.courseContent(!matches) }>
          <Helmet>
            <title>{ pageTitle }</title>
            <meta name="description" content={ pageDescription } />
            <meta name="keywords" content={ pageKeywords } />
            <meta property="og:url"           content={ `https://www.watsmymajor.com/courses/${subject}/${catalogNumber}` } />
            <meta property="og:type"          content="website" />
            <meta property="og:title"         content={ pageTitle } />
            <meta property="og:description"   content={ pageDescription } />
            <meta property="og:image"         content="https://user-images.githubusercontent.com/19257435/59579321-5233ca80-909a-11e9-855e-547cd83eeb91.png" />
          </Helmet>
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
            <div style={ styles.leftContainer(!matches) }>
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
          <div
            className="fb-like"
            style={ styles.fbLikeContainer }
            data-href={ `https://www.watsmymajor.com/courses/${subject}/${catalogNumber}` }
            data-layout="standard"
            data-action="like"
            data-share="true"
            data-show-faces="true"
          />
        </div>
      ) }
    </MediaQuery>
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
