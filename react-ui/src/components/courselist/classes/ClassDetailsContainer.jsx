import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import WatchIcon from 'material-ui/svg-icons/action/visibility';
import UnwatchIcon from 'material-ui/svg-icons/action/visibility-off';
import ClassInfo from './ClassInfo';
import ClassProf from './ClassProf';
import { objectEquals } from 'utils/arrays';
import 'stylesheets/ClassDetails.css';
import { darkRed } from 'constants/Colours';

const styles =  {
  titleContainer: {
    padding: '10px 20px',
    display: 'flex',
  },
  header: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headerText: {
    marginLeft: 0,
    fontSize: 30,
    fontWeight: 400,
  },
  watchContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20,
  },
  watchText: {
    fontSize: 13,
    margin: '0px auto',
    color: darkRed,
  },
  lastUpdated: {
    fontSize: 12,
    marginLeft: 2,
  },
  dialog: {
    width: 'fit-content',
    maxWidth: 'none',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 0,
  },
  body: {
    display: 'flex',
  },
  note: {
    fontSize: 13,
    marginTop: 30,
  },
  actions: {
    paddingTop: 0,
  },
  admURL: {
    lineHeight: 0.7,
    paddingLeft: 2,
    fontSize: 11,
  }
};

async function retrieveProfInfo(instructor) {
  try {
    const response = await fetch(`/server/prof/${instructor}`, {
      headers: {
        'x-secret': process.env.REACT_APP_SERVER_SECRET
      }
    });

    if (!response.ok) return { err: `status ${response.status}`, prof: null };

    const prof = await response.json();
    return { err:  null, prof };
  } catch (err) {
    return { err, prof: null };
  }
}

function isWatching(watchlist, term, classNumber) {
  if (!classNumber) return false;
  if (!watchlist.hasOwnProperty(term)) return false;
  return watchlist.hasOwnProperty(classNumber);
}

export default class ClassDetailsContainer extends Component {
  static propTypes = {
    classInfo: PropTypes.object.isRequired,
    watchlist: PropTypes.object.isRequired,
    admURL: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onWatch: PropTypes.func.isRequired,
    onUnwatch: PropTypes.func.isRequired,
  };

  state = {
    instructor: '',
    prof: {},
    fetchingRMP: false,
    watching: isWatching(this.props.watchlist, this.props.classInfo.classNumber),
  };

  async componentDidMount() {
    const { instructor } = this.props.classInfo;
    this.updateProfInfo(instructor);
  }

  componentWillReceiveProps(nextProps) {
    const { classes, classNumber } = nextProps.classInfo;
    if (classes == null || classes.length === 0) return;

    const { instructor } = classes[0];
    if (instructor !== this.state.instructor) {
      this.setState({ fetchingRMP: true, instructor });
      this.updateProfInfo(instructor);
    }

    if (!objectEquals(nextProps.watchlist, this.props.watchlist)) {
      const watching = isWatching(nextProps.watchlist, classNumber);
      this.setState({ watching });
    }
  }

  async updateProfInfo(instructor) {
    if (!instructor) return this.setState({ fetchingRMP: false, prof: {} });

    const { err, prof } = await retrieveProfInfo(instructor);
    this.setState({ fetchingRMP: false });
    if (err) {
      console.error(`ERROR: ${err}`);
      this.setState({ prof: {} });
      return;
    }
    this.setState({ prof });
  }

  render() {
    const  { classInfo, watchlist, admURL, open, onClose, onWatch, onUnwatch } = this.props;
    const { instructor, prof, fetchingRMP } = this.state;
    const {
      classNumber,
      units,
      topic,
      note,
      enrollmentCap,
      enrollmentTotal,
      waitingCap,
      waitingTotal,
      reserveCap,
      reserveTotal,
      reserveGroup,
      lastUpdated,
    } = classInfo;

    const actions = [
      <FlatButton
        label="Close"
        onClick={ onClose }
      />
    ];

    let watchButton = null;

    if (watchlist.hasOwnProperty(classNumber)) {
      watchButton = (
        <div style={ styles.watchContainer }>
          <RaisedButton
            label="Unwatch Class"
            labelPosition="before"
            secondary
            icon={ <UnwatchIcon /> }
            onClick={ () => onUnwatch(classNumber) }
          />
        </div>
      );
    } else if (enrollmentCap > 0 && enrollmentTotal >= enrollmentCap) {
      watchButton = (
        <div style={ styles.watchContainer }>
          <RaisedButton
            label="Watch Class"
            labelPosition="before"
            primary
            icon={ <WatchIcon /> }
            onClick={ () => onWatch(classNumber) }
          />
          <span style={ styles.watchText }>This class is full!</span>
        </div>
      );
    }

    return (
      <Dialog
        title={
          <div style={ styles.titleContainer }>
            <div style={ styles.header }>
              <span style={ styles.headerText }>Class Information</span>
              <span style={ styles.lastUpdated }>Last updated: { lastUpdated }</span>
              <span style={ styles.admURL }>
                Scraped from:
                <a href={ admURL } target="_blank" rel="noopener noreferrer">
                  adm.uwaterloo.ca
                </a>
              </span>
            </div>
            { watchButton }
          </div>
        }
        open={ open }
        actions={ actions }
        onRequestClose={ onClose }
        contentStyle={ styles.dialog }
        bodyStyle={ styles.container }
        actionsContainerStyle={ styles.actions }
      >
        <div style={ styles.body }>
          <ClassInfo
            units={ units }
            topic={ topic }
            attending={ enrollmentTotal }
            enrollmentCap={ enrollmentCap }
            waiting={ waitingTotal }
            waitingCap={ waitingCap }
            reserved={ reserveTotal }
            reserveCap={ reserveCap }
            reserveGroup={ reserveGroup }
          />
          <ClassProf
            instructor={ instructor }
            loading={ fetchingRMP }
            prof={ prof }
          />
        </div>
        {
          (note.length > 0) && (
            <i style={ styles.note }>{ `Note: ${note}` }</i>
          )
        }
      </Dialog>
    );
  }

}
