import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Chip from 'material-ui/Chip';
import { Link } from 'react-router-dom';
import { Line } from 'rc-progress';
import ProfRatings from './ProfRatings';
import { lightGreen2, red, yellow, grey } from 'constants/Colours';

const styles = {
  container: {
    borderBottom: '1px solid #dbdbdb',
    flexDirection:'column',
    textAlign: 'left',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  upperContainer: (isMobile) => ({
    flexDirection: (isMobile) ? 'column' : 'row',
    textAlign: 'left',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  }),
  leftContainer: (isMobile) => ({
    display: 'flex',
    flexDirection: (isMobile) ? 'column-reverse' : 'column',
  }),
  name: {
    fontSize: 40,
    fontWeight: 400,
    margin: 'auto 0',
    marginBottom: 5,
    marginRight: 15,
    whiteSpace: 'nowrap',
  },
  rating: (color) => ({
    fontSize: 30,
    fontWeight: 400,
    margin: 'auto 0',
    marginLeft: 10,
    whiteSpace: 'nowrap',
    color,
  }),
  coursesDiv: {
    marginTop: 10,
  },
  courseTitle: {
    fontSize: 12,
    marginRight: 7,
  },
  rightContainer: (isMobile) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: (isMobile) ? 'flex-start' : 'flex-end',
  }),
  noRatings: {
    margin: 'auto 10px',
    color: grey,
  },
  difficulty: {
    display: 'inline-block',
    marginBottom: 15,
  },
  progress: {
    width: 170,
    height: '100%',
    margin: 'auto',
    marginLeft: '10px'
  },
  ratingTags: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 'fit-content',
    margin: 'auto',
    height: 'auto',
  },
  chip: {
    margin: 2,
  },
  chipLabel: {
    fontSize: 12,
  },
};

const ProfHeader = ({
  profName,
  courses,
  rating,
  difficulty,
  numRatings,
  tags,
  rmpURL,
}) => {
  const percentage = (Number(difficulty) / 5.0) * 100;
  const barColour = (percentage > 66)
    ? red
    : (percentage > 33)
      ? yellow
      : lightGreen2;

  const upperContainer = (isMobile) => (numRatings === 0)
    ? (
      <div style={ styles.upperContainer(isMobile) }>
        <div style={ styles.leftContainer(isMobile) }>
          <h1 style={ styles.name }>{ profName }</h1>
        </div>
        <div style={ styles.rightContainer(isMobile) }>
          <span style={ styles.noRatings }>No ratings yet</span>
        </div>
      </div>
    )
    : (
      <div style={ styles.upperContainer(isMobile) }>
        <div style={ styles.leftContainer(isMobile) }>
          <h1 style={ styles.name }>{ profName }</h1>
          <ProfRatings rating={ rating } numRatings={ numRatings } />
        </div>
        <div style={ styles.rightContainer(isMobile) }>
          <div>
            <div style={ styles.difficulty }>
              <span style={{ fontSize: 20 }}>Difficulty:</span>
              <Line
                style={ styles.progress }
                strokeWidth="8"
                strokeColor={ barColour }
                trailWidth="8"
                percent={ `${percentage}` }
              />
              { !isMobile && (
                <span style={ styles.rating(barColour) }>{ difficulty }</span>
              ) }
            </div>
            <div style={{ display: 'flex' }}>
              <div style={ styles.ratingTags }>
                { tags.map((tag, index) => (
                  <Chip
                    style={ styles.chip }
                    labelStyle={ styles.chipLabel }
                    key={ index }
                  >
                    { tag }
                  </Chip>
                )) }
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <MediaQuery minWidth={ 650 }>
      { matches => {
        const isMobile = (global.isMobile != null) ? global.isMobile : !matches;
        return (
          <div style={ styles.container }>
            { upperContainer(isMobile) }
            {
              courses.length > 0 && (
                <div style={ styles.coursesDiv }>
                  <span style={{ fontSize: 12, marginRight: 7 }}>Courses taught:</span>
                  {
                    courses.map(({ subject, catalogNumber }, i) => {
                      const course = (i < courses.length - 1)
                        ? `${subject} ${catalogNumber}, `
                        : `${subject} ${catalogNumber}`;
                      return (
                        <Link key={ i } to={ `/courses/${subject}/${catalogNumber}` }>
                          <span style={ styles.courseTitle }>{ course }</span>
                        </Link>
                      );
                    })
                  }
                </div>
              )
            }
          </div>
        );
      } }
    </MediaQuery>
  );
}

ProfHeader.propTypes = {
  profName: PropTypes.string.isRequired,
  courses: PropTypes.array.isRequired,
  rating: PropTypes.number.isRequired,
  difficulty: PropTypes.number.isRequired,
  numRatings: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
  rmpURL: PropTypes.string.isRequired,
};

export default ProfHeader;
