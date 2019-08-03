import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { yellow, grey, darkRed, green } from 'constants/Colours';
import { objectEquals } from 'utils/arrays';

const styles = {
  container: (isMobile) => ({
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '0.5px solid grey',
    display: 'flex',
    flexDirection: (isMobile) ? 'column-reverse' : 'row',
    width: '100%',
  }),
  leftContainer: (isMobile) => ({
    display: 'flex',
    flexDirection: (isMobile) ? 'row' : 'column',
    textAlign: 'left',
    marginRight: (isMobile) ? 0 : 15,
    marginTop: (isMobile) ? 10 : 0,
    fontSize: 12,
    borderRight: (isMobile) ? 'none' : `1px solid ${grey}`,
    minWidth: 132,
  }),
  infoList: (isMobile) => ({
    display: 'flex',
    flexDirection: 'column',
    marginRight: (isMobile) ? 20 : 0,
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
  infoTitle: {
    marginRight:  4,
  },
  infoItem: {
    marginRight: 0,
    marginBottom: 4,
    color: grey,
    display: 'flex',
    flexGrow: 1,
    textAlign: 'left',
  },
  colourLabel: (num) => ({
    marginLeft: 5,
    marginRight: 15,
    backgroundColor: (num <= 2) ? darkRed : (num >= 4) ? green : yellow,
    color: 'white',
    padding: '1.5px 6px',
    borderRadius: 5,
    display: 'inline'
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
  term: {
    marginRight: 5,
    fontSize: 14,
    fontWeight: 500,
  },
  commentContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  commentHeader: {
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 3,
    fontSize: 16,
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
  birdUrl: {
    fontSize: 10,
    float: 'left',
    marginTop: 7,
  },
}

const boolToText = (val) => (val == null) ? 'N/A' : (val) ? 'Yes' : 'No';

export default class Review extends Component {

  static propTypes = {
    prof: PropTypes.string,
    profId: PropTypes.string,
    term: PropTypes.string,
    year: PropTypes.number,
    date: PropTypes.string.isRequired,
    comments: PropTypes.string.isRequired,
    advice: PropTypes.string,
    interesting: PropTypes.number,
    useful: PropTypes.number,
    easy: PropTypes.number,
    isMandatory: PropTypes.bool,
    textbookUsed: PropTypes.bool,
    grade: PropTypes.string,
    numThumbsUp: PropTypes.number,
    numThumbsDown: PropTypes.number,
    birdURL: PropTypes.string,
    onVote: PropTypes.func,
  };

  static defaultProps = {
    prof: '',
  };

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  shouldComponentUpdate(nextProps) {
    return !objectEquals(this.props, nextProps);
  }

  render() {
    const {
      prof,
      profId,
      date,
      term,
      year,
      interesting,
      useful,
      easy,
      isMandatory,
      textbookUsed,
      grade,
      comments,
      advice,
      numThumbsUp,
      numThumbsDown,
      birdURL,
      onVote,
    } = this.props;
    const isBird = birdURL != null;

    const commentSection = (isBird)
      ? (
        <div style={{ marginTop: 5 }}>
          <p style={ styles.text }>{ comments }</p>
          { birdURL && (
            <a
              style={ styles.birdUrl }
              rel="noopener noreferrer"
              href={ birdURL }
              target="_blank"
            >
              Retrieved from birdcourses.com
            </a>
          ) }
        </div>
      )
      : (
        <div>
          <div style={ styles.commentContainer }>
            <p style={ styles.commentHeader }>Comments:</p>
            <p style={ styles.text }>{ comments }</p>
          </div>
          {
            advice.length > 0 && (
              <div style={ styles.commentContainer }>
                <p style={ styles.commentHeader }>Advice:</p>
                <p style={ styles.text }>{ advice }</p>
              </div>
            )
          }
        </div>
      );

    const profText = (profId != null && profId.length > 0)
      ? (
        <a
          rel="noopener noreferrer"
          href={ `/professors/${profId}` }
          target='_blank'
          style={ styles.term }
        >{ prof }</a>
      )
      : (
        <span style={ styles.term }>{ prof }</span>
      );
    return (
      <MediaQuery minWidth={ 600 }>
        { matches => {
          const isMobile = (global.isMobile != null) ? global.isMobile : !matches;
          return (
            <div style={ styles.container(isMobile) }>
              <div style={ styles.leftContainer(isMobile) }>
                { !isMobile && (
                  <span style={ styles.date }>{ date }</span>
                ) }
                { !isBird && (
                  <div style={ styles.infoList(isMobile) }>
                    <div style={ styles.infoItem }>
                      <span style={ styles.infoTitle }>Easy:</span>
                      <span style={ styles.colourLabel(easy) }>{ easy }</span>
                    </div>
                    <div style={ styles.infoItem }>
                      <span style={ styles.infoTitle }>Useful:</span>
                      <span style={ styles.colourLabel(useful) }>{ useful }</span>
                    </div>
                    <div style={ styles.infoItem }>
                      <span style={ styles.infoTitle }>Interesting:</span>
                      <span style={ styles.colourLabel(interesting) }>{ interesting }</span>
                    </div>
                  </div>
                ) }
                <div style={ styles.infoList(isMobile) }>
                  <div style={ styles.infoItem }>
                    <span style={ styles.infoTitle }>Attendance:</span>
                    <span>
                      { (isMandatory == null)
                        ? 'N/A'
                        : (isMandatory) ? 'Mandatory' : 'Optional'
                      }
                    </span>
                  </div>
                  <div style={ styles.infoItem }>
                    <span style={ styles.infoTitle }>Textbook Used:</span>
                    <span>{ boolToText(textbookUsed) }</span>
                  </div>
                  <div style={ styles.infoItem }>
                    <span style={ styles.infoTitle }>Grade:</span>
                    <span>{ (grade == null) ? 'N/A' : grade }</span>
                  </div>
                </div>
              </div>
              <div style={ styles.rightContainer }>
                {
                  !isBird && (
                    <div style={ styles.upperContainer }>
                      <div style={ styles.reviewTitle(isMobile) }>
                        { term.length > 0 && (
                          <span style={ styles.term }>
                            { `${term} ${year}` }
                            { prof.length > 0 && ' - ' }
                          </span>
                        ) }
                        { prof.length > 0 && profId != null && profText }
                      </div>
                      <div style={ styles.thumbsContainer }>
                        <div style={ styles.thumbInnerContainer }>
                          <IconButton
                            style={{ padding: 5 }}
                            onClick={ () => onVote(1) }
                          >
                            <FontIcon className="material-icons" style={ styles.thumb }>
                              thumb_up
                            </FontIcon>
                          </IconButton>
                          <span>{ numThumbsUp }</span>
                        </div>
                        <div style={ styles.thumbInnerContainer }>
                          <IconButton
                            style={{ padding: 5 }}
                            onClick={ () => onVote(-1) }
                          >
                            <FontIcon className="material-icons" style={ styles.thumb }>
                              thumb_down
                            </FontIcon>
                          </IconButton>
                          <span>{ numThumbsDown }</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                { isMobile && (
                  <div style={ styles.mobileDate }>
                    <span>{ date }</span>
                  </div>
                ) }
                { commentSection }
              </div>
            </div>
          );
        } }
      </MediaQuery>
    );
  }

}
