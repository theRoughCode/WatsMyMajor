import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import StarRatings from 'react-star-ratings';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { yellow, grey } from 'constants/Colours';

const styles = {
  container: {
    marginBottom: 25,
  },
  info: (isMobile) => ({
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    paddingRight: (isMobile) ? 0 : 15,
    marginRight: (isMobile) ? 0 : 15,
    fontSize: 12,
    borderRight: (isMobile) ? 'none' : `1px solid ${grey}`,
  }),
  infoList: (isMobile) => ({
    display: 'flex',
    flexDirection: (isMobile) ? 'row' : 'column',
  }),
  date: (isMobile) => ({
    fontSize: 14,
    marginBottom: (isMobile) ? 5 : 10,
    fontWeight: 500,
  }),
  infoItem: (isMobile) => ({
    marginRight: (isMobile) ? 5 : 0,
    marginBottom: 4,
    color: (isMobile) ? grey : 'black',
  }),
  reviewTitle: (isMobile) => ({
    display: 'flex',
    alignItems: 'flex-start',
  }),
  classTaken: {
    marginRight: 10,
    fontWeight: 500,
  },
  thumbsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  thumbInnerContainer: {
    marginLeft: 5,
    display: 'inline-block',
  },
  thumbButton: {
    width: 15,
    height: 15,
  },
  thumb: {
    fontSize: 15,
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 0,
  },
  rmpUrl: {
    fontSize: 10,
    float: 'left',
    marginTop: 7,
  },
}

const boolToText = (val) => (val) ? 'Yes' : 'No';

const Review = ({
  subject,
  catalogNumber,
  date,
  overallScore,
  difficulty,
  isMandatory,
  textbookUsed,
  grade,
  comments,
  numThumbsUp,
  numThumbsDown,
  rmpURL,
}) => {
  return (
    <MediaQuery minWidth={ 600 }>
      { matches => {
        const isMobile = (global.isMobile != null) ? global.isMobile : !matches;
        return (
          <div style={ styles.container }>
            <Grid container>
              <Grid item style={ styles.info(isMobile) }>
                <span style={ styles.date(isMobile) }>{ date }</span>
                <div style={ styles.infoList(isMobile) }>
                  <span style={ styles.infoItem(isMobile) }>{ `Difficulty: ${difficulty}` }{ isMobile && ',' }</span>
                  <span style={ styles.infoItem(isMobile) }>{ `Mandatory: ${boolToText(isMandatory)}` }{ isMobile && ', ' }</span>
                  <span style={ styles.infoItem(isMobile) }>{ `Textbook Used: ${boolToText(textbookUsed)}` }{ isMobile && ', ' }</span>
                  <span style={ styles.infoItem(isMobile) }>{ `Grade: ${grade}` }</span>
                </div>
              </Grid>
              <Grid item xs={ 12 } sm container>
                <Grid item xs>
                  <Grid container>
                    <Grid item xs>
                      <div style={ styles.reviewTitle(isMobile) }>
                        <span style={ styles.classTaken }>{ `${subject} ${catalogNumber}` }</span>
                        <StarRatings
                          rating={ overallScore }
                          isSelectable={ false }
                          isAggregateRating
                          numOfStars={ 5 }
                          starRatedColor={ yellow }
                          starDimension="18px"
                          starSpacing="1px"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={ 3 } style={ styles.thumbsContainer }>
                      <div style={ styles.thumbInnerContainer }>
                        <IconButton style={{ padding: 5 }}>
                          <FontIcon className="material-icons" style={ styles.thumb }>
                            thumb_up
                          </FontIcon>
                        </IconButton>
                        <span>{ numThumbsUp }</span>
                      </div>
                      <div style={ styles.thumbInnerContainer }>
                        <IconButton style={{ padding: 5 }}>
                          <FontIcon className="material-icons" style={ styles.thumb }>
                            thumb_down
                          </FontIcon>
                        </IconButton>
                        <span>{ numThumbsDown }</span>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <p style={ styles.text }>{ comments }</p>
                    { rmpURL && (
                      <a
                        style={ styles.rmpUrl }
                        rel="noopener noreferrer"
                        href={ rmpURL }
                        target="_blank"
                      >
                        Retrieved from ratemyprofessors.com
                      </a>
                    ) }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        );
      } }
    </MediaQuery>
  );
}

Review.propTypes = {
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  overallScore: PropTypes.number.isRequired,
  difficulty: PropTypes.number.isRequired,
  isMandatory: PropTypes.bool.isRequired,
  textbookUsed: PropTypes.bool.isRequired,
  grade: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  numThumbsUp: PropTypes.number.isRequired,
  numThumbsDown: PropTypes.number.isRequired,
  rmpURL: PropTypes.string,
};

export default Review;
