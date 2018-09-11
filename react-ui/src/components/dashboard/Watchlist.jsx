import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { objectEquals, arrayEquals } from '../../utils/arrays';

const CURRENT_TERM = '1189';

const styles = {
  container: {
    width: 'fit-content',
    height: 'fit-content',
    margin: 'auto',
    marginTop: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: 500,
  },
};

// Gets subject and catalog number for classes in watchlist
const getWatchlistInfo = async watchlist => {
  let classes = Object.keys(watchlist[CURRENT_TERM]);

  classes = await Promise.all(classes.map(async classNum => {
    try {
  		const response = await fetch(`/server/watchlist/info/${CURRENT_TERM}/${classNum}`, {
  			headers: {
  				'x-secret': process.env.REACT_APP_SERVER_SECRET
  			}
  		});

  		if (!response.ok) return { subject: '', catalogNumber: '', classNum };

  		const { subject, catalogNumber } = await response.json();
  		return { subject, catalogNumber, classNum };
  	} catch (err) {
      console.log(err);
  		return { subject: '', catalogNumber: '', classNum };
  	}
  }));

  return classes;
}

// Compares state's watchlist to nextProps'.  Returns true if changed.
const watchlistChanged = (state, nextProps) => {
  const classNums = state.map(c => c.classNum);
  return !arrayEquals(classNums, Object.keys(nextProps));
};

class Watchlist extends Component {
  static propTypes = {
    watchlist: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onUnwatch: PropTypes.func.isRequired,
  };

  state = {
    watchlist: [],
    dialogOpen: false,
    toBeDeleted: -1, // index of class to be deleted
  };

  async componentDidMount() {
    const watchlist = await getWatchlistInfo(this.props.watchlist);
    this.setState({ watchlist });
  }

  async componentWillReceiveProps(nextProps) {
    if (watchlistChanged(this.state.watchlist, nextProps.watchlist[CURRENT_TERM])) {
      const watchlist = await getWatchlistInfo(nextProps.watchlist);
      this.setState({ watchlist });
    }
  }

  // Navigates to course
  onClassClick = (subject, catalogNumber) => {
    this.props.history.push(`/courses/${subject}/${catalogNumber}`);
  }

  onDeleteClick = (index) => this.setState({ toBeDeleted: index, dialogOpen: true });

  onSubmit = () => {
    if (this.state.toBeDeleted < 0) return;
    const selectedClass = this.state.watchlist[this.state.toBeDeleted];
    this.props.onUnwatch(CURRENT_TERM, selectedClass.classNum);
    this.closeDialog();
  }

  closeDialog = () => this.setState({ toBeDeleted: -1, dialogOpen: false });

  render() {
    const { watchlist, toBeDeleted, dialogOpen } = this.state;
    if (watchlist.length === 0) return null;

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
            watchlist.map(({ subject, catalogNumber, classNum }, index) => (
              <ListItem
                key={ index }
                primaryText={ `${subject} ${catalogNumber} (${classNum})` }
                onClick={ this.onClassClick.bind(this, subject, catalogNumber) }
                rightIconButton={
                  <IconButton tooltip="Unwatch" onClick={ this.onDeleteClick.bind(this, index) }>
                    <DeleteIcon />
                  </IconButton>
                }
              />
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
