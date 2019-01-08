import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { termNumToStr } from 'utils/courses';
import { arrayOfObjectEquals } from 'utils/arrays';

const styles = {
  container: {
    width: 'fit-content',
    height: 'fit-content',
    margin: 'auto',
  },
  header: {
    fontSize: 20,
    fontWeight: 500,
  },
  termContainer: {
    marginTop: 10,
  },
  termTitle: {
    fontSize: 18,
    textDecoration: 'underline',
  }
};

// Gets subject and catalog number for classes in watchlist
const getClassInfo = async (classNum, term) => {
  try {
    const response = await fetch(`/server/watchlist/info/${term}/${classNum}`, {
      headers: {
        'x-secret': process.env.REACT_APP_SERVER_SECRET
      }
    });

    if (!response.ok) return { subject: null, catalogNumber: null, classNum };
    const { subject, catalogNumber } = await response.json();
    return { subject, catalogNumber };
  } catch (err) {
    console.error(err);
    return { subject: null, catalogNumber: null };
  }
}

const WatchlistItem = ({
  index,
  term,
  subject,
  catalogNumber,
  classNum,
  onClassClick,
  onDeleteClick,
}) => {
  const classClickHandler = () => onClassClick(subject, catalogNumber);
  const deleteClickHandler = () => onDeleteClick(classNum, term);

  return (
    <ListItem
      primaryText={ `${subject} ${catalogNumber} (${classNum})` }
      onClick={ classClickHandler }
      rightIconButton={
        <IconButton tooltip="Unwatch" onClick={ deleteClickHandler }>
          <DeleteIcon />
        </IconButton>
      }
    />
  );
};

WatchlistItem.propTypes = {
  index: PropTypes.number.isRequired,
  term: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  classNum: PropTypes.string.isRequired,
  onClassClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

class Watchlist extends Component {
  static propTypes = {
    watchlist: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onUnwatch: PropTypes.func.isRequired,
  };

  state = {
    watchlist: {},
    dialogOpen: false,
    toBeDeleted: {}, // index of class to be deleted
  };

  async componentDidMount() {
    const watchlist = await this.getWatchlistInfo(this.props.watchlist);
    this.setState({ watchlist });
  }

  async componentWillReceiveProps(nextProps) {
    if (!arrayOfObjectEquals(this.state.watchlist, nextProps.watchlist)) {
      const watchlist = await this.getWatchlistInfo(nextProps.watchlist);
      this.setState({ watchlist });
    }
  }

  getWatchlistInfo = async (watchlist) => {
    if (Object.keys(watchlist) === 0) return {};
    const newWatchList = {};
    for (let term in watchlist) {
      newWatchList[term] = await Promise.all(
        Object.keys(watchlist[term]).map(async classNum => {
          const { subject, catalogNumber } = await getClassInfo(classNum, term);
          return { subject, catalogNumber, classNum };
        })
      )
    }
    return newWatchList;
  }

  // Navigates to course
  onClassClick = (subject, catalogNumber) => {
    this.props.history.push(`/courses/${subject}/${catalogNumber}`);
  }

  onDeleteClick = (classNum, term) =>
    this.setState({ toBeDeleted: { classNum, term }, dialogOpen: true });

  onSubmit = () => {
    if (Object.keys(this.state.toBeDeleted).length === 0) return;
    this.props.onUnwatch(this.state.toBeDeleted.term, this.state.toBeDeleted.classNum);
    this.closeDialog();
  }

  closeDialog = () => this.setState({ toBeDeleted: {}, dialogOpen: false });

  render() {
    const { watchlist, toBeDeleted, dialogOpen } = this.state;
    if (Object.keys(watchlist).length === 0) return null;

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.closeDialog }
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onClick={ this.onSubmit }
      />,
    ];

    return (
      <Paper style={ styles.container } depth={ 1 }>
        <List>
          <span style={ styles.header }>Class Watchlist</span>
          {
            Object.keys(watchlist).map((term, index) => (
              <div key={ index } style={ styles.termContainer }>
                <span style={ styles.termTitle }>{ termNumToStr(term) }</span>
                {
                  watchlist[term].map(({ subject, catalogNumber, classNum }, index) => (
                    <WatchlistItem
                      key={ index }
                      index={ index }
                      term={ term }
                      subject={ subject }
                      catalogNumber={ catalogNumber }
                      classNum={ classNum }
                      onClassClick={ this.onClassClick }
                      onDeleteClick={ this.onDeleteClick }
                    />
                  ))
                }
              </div>
            ))
          }
        </List>
        <Dialog
          title="Are you sure?"
          actions={ actions }
          modal={ false }
          open={ dialogOpen }
          onRequestClose={ this.closeDialog }
        >
          { toBeDeleted >= 0 && `
            Are you sure you want to remove ${watchlist[toBeDeleted].subject}
            ${watchlist[toBeDeleted].catalogNumber} (${watchlist[toBeDeleted].classNum})
            from your watchlist?
          ` }
        </Dialog>
      </Paper>
    );
  }
}

export default Watchlist;
