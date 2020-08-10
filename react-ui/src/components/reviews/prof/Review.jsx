import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import StarRatings from 'react-star-ratings';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { yellow, grey } from 'constants/Colours';
import { objectEquals } from 'utils/arrays';

const styles = {
  container: (isMobile) => ({
    marginBottom: 25,
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : 'row',
    width: '100%',
  }),
  leftContainer: (isMobile) => ({
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    marginRight: isMobile ? 0 : 15,
    marginTop: isMobile ? 10 : 0,
    fontSize: 12,
    borderRight: isMobile ? 'none' : `1px solid ${grey}`,
    minWidth: 132,
  }),
  infoList: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
  }),
  mobileDate: {
    textAlign: 'left',
    fontSize: 12,
    color: grey,
  },
  date: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 500,
  },
  infoTitle: (isMobile) => ({
    marginRight: isMobile ? 0 : 4,
  }),
  infoItem: (isMobile) => ({
    marginRight: isMobile ? 5 : 0,
    marginBottom: 4,
    color: isMobile ? grey : 'black',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    flexGrow: 1,
    textAlign: isMobile ? 'center' : 'left',
  }),
  rightContainer: {
    flexGrow: 1,
  },
  upperContainer: {
    width: '100%',
    display: 'flex',
  },
  reviewTitle: (isMobile) => ({
    display: 'flex',
    alignItems: 'flex-start',
    flexGrow: 1,
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
  thumb: (isRmp) => ({
    fontSize: 15,
    color: isRmp ? 'grey' : 'black',
  }),
  text: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 0,
  },
  rmpUrl: {
    fontSize: 10,
    float: 'left',
    marginTop: 7,
  },
};

const boolToText = (val) => (val == null ? 'N/A' : val ? 'Yes' : 'No');

export default class Review extends Component {
  static propTypes = {
    subject: PropTypes.string,
    catalogNumber: PropTypes.string,
    date: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    difficulty: PropTypes.number,
    isMandatory: PropTypes.bool,
    textbookUsed: PropTypes.bool,
    grade: PropTypes.string,
    comments: PropTypes.string.isRequired,
    numThumbsUp: PropTypes.number.isRequired,
    numThumbsDown: PropTypes.number.isRequired,
    rmpURL: PropTypes.string,
    onVote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    subject: '',
    catalogNumber: '',
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  shouldComponentUpdate(nextProps) {
    return !objectEquals(this.props, nextProps);
  }

  render() {
    const {
      subject,
      catalogNumber,
      date,
      rating,
      difficulty,
      isMandatory,
      textbookUsed,
      grade,
      comments,
      numThumbsUp,
      numThumbsDown,
      rmpURL,
      onVote,
    } = this.props;
    const isRmp = rmpURL != null;
    return (
      <MediaQuery minWidth={600}>
        {(matches) => {
          const isMobile = global.isMobile != null ? global.isMobile : !matches;
          return (
            <div style={styles.container(isMobile)}>
              <div style={styles.leftContainer(isMobile)}>
                {!isMobile && <span style={styles.date}>{date}</span>}
                <div style={styles.infoList(isMobile)}>
                  <div style={styles.infoItem(isMobile)}>
                    <span style={styles.infoTitle(isMobile)}>Difficulty:</span>
                    <span>{difficulty == null ? 'N/A' : difficulty}</span>
                  </div>
                  <div style={styles.infoItem(isMobile)}>
                    <span style={styles.infoTitle(isMobile)}>Attendance:</span>
                    <span>
                      {isMandatory == null ? 'N/A' : isMandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                  <div style={styles.infoItem(isMobile)}>
                    <span style={styles.infoTitle(isMobile)}>Textbook Used:</span>
                    <span>{boolToText(textbookUsed)}</span>
                  </div>
                  <div style={styles.infoItem(isMobile)}>
                    <span style={styles.infoTitle(isMobile)}>Grade:</span>
                    <span>{grade == null ? 'N/A' : grade}</span>
                  </div>
                </div>
              </div>
              <div style={styles.rightContainer}>
                <div style={styles.upperContainer}>
                  <div style={styles.reviewTitle(isMobile)}>
                    {subject.length > 0 && (
                      <a
                        rel="noopener noreferrer"
                        href={`/courses/${subject}/${catalogNumber}`}
                        target="_blank"
                        style={styles.classTaken}
                      >{`${subject} ${catalogNumber}`}</a>
                    )}
                    <StarRatings
                      rating={rating}
                      isSelectable={false}
                      isAggregateRating
                      numOfStars={5}
                      starRatedColor={yellow}
                      starDimension="18px"
                      starSpacing="1px"
                    />
                  </div>
                  <div style={styles.thumbsContainer}>
                    <div style={styles.thumbInnerContainer}>
                      <IconButton style={{ padding: 5 }} disabled={isRmp} onClick={() => onVote(1)}>
                        <FontIcon className="material-icons" style={styles.thumb(isRmp)}>
                          thumb_up
                        </FontIcon>
                      </IconButton>
                      <span>{numThumbsUp}</span>
                    </div>
                    <div style={styles.thumbInnerContainer}>
                      <IconButton
                        style={{ padding: 5 }}
                        disabled={isRmp}
                        onClick={() => onVote(-1)}
                      >
                        <FontIcon className="material-icons" style={styles.thumb(isRmp)}>
                          thumb_down
                        </FontIcon>
                      </IconButton>
                      <span>{numThumbsDown}</span>
                    </div>
                  </div>
                </div>
                {isMobile && (
                  <div style={styles.mobileDate}>
                    <span>{date}</span>
                  </div>
                )}
                <div>
                  <p style={styles.text}>{comments}</p>
                  {rmpURL && (
                    <a
                      style={styles.rmpUrl}
                      rel="noopener noreferrer"
                      href={rmpURL}
                      target="_blank"
                    >
                      Retrieved from ratemyprofessors.com
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </MediaQuery>
    );
  }
}
