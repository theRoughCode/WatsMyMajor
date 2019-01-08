import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import CopyIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CalendarContainer from './CalendarContainer';
import ParserInstructions from '../tools/ParserInstructions';
import LoadingView from '../tools/LoadingView';
import { addToSchedule, clearSchedule } from 'actions';
import { objectEquals } from 'utils/arrays';
import { getCookie } from 'utils/cookies';

const stepContents = [
  {
    button: 'Log in to Quest',
    text: <p>Log in to your Quest account <a href="https://quest.pecs.uwaterloo.ca/psp/SS" target="_blank" rel="noopener noreferrer">here</a>.</p>
  },
  {
    button: 'Enroll',
    text: (
      <ol style={{ textAlign: 'left' }}>
        <li>Click on the <b>Enroll</b> tab.</li>
        <li>Select <b>My Class Schedule</b></li>
        <li>Go to <b>List View</b>.</li>
      </ol>
    )
  },
  {
    button: 'Select all and copy text',
    text: <p>Select all (<i>ctrl-a</i>), and copy EVERYTHING!!</p>
  },
];

const fetchUserSchedule = async (username) => {
  try {
    const response = await fetch(`/server/schedule/${username}`, {
      headers: {
        'x-secret': process.env.REACT_APP_SERVER_SECRET,
      }
    });
    if (!response.ok) {
      console.error(response);
      return null;
    }
    const resp = await response.json();
    return resp;
  } catch(err) {
    console.error(err);
    return null;
  }
};

// Set privacy of user's schedule
const setSchedulePrivacy = async (username, isPublic) => {
  try {
    const response = await fetch(`/server/users/schedule/privacy/${username}?public=${isPublic}`, {
      headers: {
        'x-secret': process.env.REACT_APP_SERVER_SECRET,
        'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
      }
    });
    if (!response.ok) {
      console.error(response);
      return false;
    }
    await response.text();
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
};

class ToastCopy extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  };

  state = {
    copied: false,
  };

  handleCopy = () => {
    if (this.state.copied) return;
    const linkInput = document.getElementById('schedule-link');
    linkInput.select();
    document.execCommand("copy");
    this.setState({ copied: true });
  };

  render() {
    const link = `https://www.watsmymajor.com/schedule/${this.props.username}`;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>Share with your friends!</span>
        <div style={{ marginTop: 5 }}>
          <input
            type="url"
            id="schedule-link"
            value={ link }
            readOnly
            style={{ verticalAlign: 'middle' }}
          />
          <IconButton
            tooltip={ (this.state.copied) ? "Copied!" : "Copy" }
            tooltipPosition="top-center"
            onClick={ this.handleCopy }
            iconStyle={{ width: 20, height: 20, color: 'white' }}
            style={{
              padding: 5,
              verticalAlign: 'middle',
              width: 'auto',
              height: 'auto',
            }}
          >
            { (this.state.copied)
              ? <CheckIcon color="white" />
              : <CopyIcon color="white" />
            }
          </IconButton>
        </div>
      </div>
    );
  }
}

class ScheduleContainer extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    schedule: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onUploadSchedule: PropTypes.func.isRequired,
    onClearSchedule: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  state = {
    text: '',
    schedule: this.props.schedule,
    friendSchedule: {},
    friendName: '',                 // name of schedule owner (used for browsing)
    submitted: false,
    importDialogOpen: false,
    loading: true,
    isBrowsing: false,              // true if browsing other schedules,
    term: '',                       // term to view
    isPublic: this.props.isPublic,
  };

  componentDidMount = () => {
    const { params, path } = this.props.match;
    if (params.term != null) this.setState({ term: params.term });
    this.updateSchedule(params.username, path);
  }

  componentWillReceiveProps = (nextProps) => {
    const { params, path } = nextProps.match;
    // New friend schedulle
    if (this.props.match.path !== path ||
        this.props.match.params.username !== params.username) {
      this.setState({ loading: true });
      this.updateSchedule(params.username, path);
    }

    // Change viewing term
    if (this.props.match.params.term !== params.term) {
      const term = (params.term == null) ? '' : params.term;
      this.setState({ term });
    }

    // User schedule updated
    if (!objectEquals(nextProps.schedule, this.props.schedule)) {
      this.setState({ schedule: nextProps.schedule });
    }
  }

  // Update schedule based on given path
  // If path starts with 'schedule', we are browsing other schedules
  // If path starts with 'my-schedule', we are editing our schedule
  updateSchedule = async (username, path) => {
    if (path.startsWith('/schedule')) {
      this.setState({ isBrowsing: true });
      const resp = await fetchUserSchedule(username);
      if (resp == null) {
        toast.error(`Oops!  We could not locate ${username}'s schedule.`);
        this.setState({ loading: false });
      } else {
        const { schedule, name } = resp;
        document.title = `${name}'s Schedule - WatsMyMajor`;
        this.setState({ friendSchedule: schedule, friendName: name, loading: false });
      }
    } else {
      document.title = 'My Schedule - WatsMyMajor';
      this.setState({
        loading: false,
        friendSchedule: {},
        friendName: '',
        isBrowsing: false,
      });
    }
  }

  onOpenDialog = () => this.setState({ importDialogOpen: true });
  onCloseDialog = () => this.setState({ importDialogOpen: false });

  onChange = (text) => this.setState({ text });

  onSubmit = (e) => {
    e.preventDefault();
    const { username, onUploadSchedule } = this.props;
    onUploadSchedule(username, this.state.text);
    this.setState({ submitted: true, importDialogOpen: false });
  }

  onClassClick = (subject, catalogNumber) => this.props.history.push(`/courses/${subject}/${catalogNumber}`);
  onClearScheduleClick = () => this.props.onClearSchedule(this.props.username);

  onUpdatePrivacy = () => {
    const isPublic = !this.state.isPublic;
    if (!setSchedulePrivacy(this.props.username, isPublic)) toast('Failed to update schedule privacy.  Please contact an administrator.');
    else this.setState({ isPublic });

    if (isPublic) toast(<ToastCopy username={ this.props.username } />, {
      type: 'info',
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingView />;
    }

    // Browsing other user's schedule
    if (this.state.isBrowsing) {
      return (
        <CalendarContainer
          schedule={ this.state.schedule }
          term={ this.state.term }
          onClassClick={ this.onClassClick }
          onClearSchedule={ this.onClearScheduleClick }
          onImportTerm={ this.onOpenDialog }
          onUpdatePrivacy={ this.onUpdatePrivacy }
          isBrowsing
          friendSchedule={ this.state.friendSchedule }
          friendName={ this.state.friendName }
          isPublic={ this.state.isPublic }
        />
      );
    }

    const importDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.onCloseDialog }
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={ this.onSubmit }
        disabled={ this.state.text.length === 0 }
      />,
    ];

    return (Object.keys(this.props.schedule).length > 0)
      ? (
        <div style={{ height: '100%' }}>
          <CalendarContainer
            schedule={ this.state.schedule }
            term={ this.state.term }
            onClassClick={ this.onClassClick }
            onClearSchedule={ this.onClearScheduleClick }
            onImportTerm={ this.onOpenDialog }
            onUpdatePrivacy={ this.onUpdatePrivacy }
            isBrowsing={ false }
            friendSchedule={ this.state.friendSchedule }
            friendName={ this.state.friendName }
            isPublic={ this.state.isPublic }
          />
          <Dialog
            title="Import Schedule"
            actions={ importDialogActions }
            modal={ false }
            open={ this.state.importDialogOpen }
            onRequestClose={ this.closeImportDialog }
            contentStyle={{ width: 900, maxWidth: 'none', height: 600 }}
          >
            <ParserInstructions
              onChange={ this.onChange }
              stepContents={ stepContents }
            />
          </Dialog>
        </div>
      )
      : (
        <div style={{ marginTop: 50 }}>
          <ParserInstructions
            onChange={ this.onChange }
            stepContents={ stepContents }
          />
          <RaisedButton
            label="Submit"
            primary
            onClick={ this.onSubmit }
            disabled={ this.state.text.length === 0 }
          />
        </div>
      )
  }
}

const mapStateToProps = ({ user, mySchedule }) => ({
  username: user.username,
  isPublic: (user.isSchedulePublic == null) || user.isSchedulePublic,
  schedule: mySchedule,
});

const mapDispatchToProps = dispatch => ({
  onUploadSchedule: (username, text) => dispatch(addToSchedule(username, text)),
  onClearSchedule: (username) => dispatch(clearSchedule(username)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleContainer));
