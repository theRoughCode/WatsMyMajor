import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CalendarContainer from './CalendarContainer';
import ParserInstructions from '../tools/ParserInstructions';
import LoadingView from '../tools/LoadingView';
import { addToSchedule, clearSchedule } from '../../actions';
import { objectEquals } from '../../utils/arrays';
import { getCookie } from '../../utils/cookies';

const stepContents = [
  {
    button: 'Log in to Quest',
    text: <p>Log in to your Quest account <a href="https://quest.pecs.uwaterloo.ca/psp/SS" target="_blank" rel="noopener noreferrer">here</a>.</p>
  },
  {
    button: 'Enroll',
    text: <p>Click on the <b>Enroll</b> tab and select the term you want to add to your schedule.</p>
  },
  {
    button: 'Select all and copy text',
    text: <p>Go to <b>List View</b>, select all (<i>ctrl-a</i>), and copy EVERYTHING!!</p>
  },
];

const fetchUserSchedule = async (username) => {
  try {
    const response = await fetch(`/server/users/schedule/${username}`, {
      headers: {
        'x-secret': process.env.REACT_APP_SERVER_SECRET,
        'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
      }
    });
    if (!response.ok) {
      console.error(response);
      return null;
    }
    const schedule = await response.json();
    return schedule;
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

class ScheduleContainer extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    schedule: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onUploadSchedule: PropTypes.func.isRequired,
    onClearSchedule: PropTypes.func.isRequired,
  };

  state = {
    text: '',
    schedule: {},
    submitted: false,
    importDialogOpen: false,
    loading: true,
    isBrowsing: false,        // true if browsing other schedules
    isPublic: this.props.isPublic,
  };

  componentDidMount = async () => {
    const { params, path } = this.props.match;
    if (path.startsWith('/schedule')) {
      this.setState({ isBrowsing: true });
      const schedule = await fetchUserSchedule(params.username);
      if (schedule == null) {
        toast.error(`Oops!  We could not locate ${params.username}'s schedule.`);
        this.setState({ loading: false });
      } else this.setState({ schedule, loading: false });
    } else this.setState({ loading: false, schedule: this.props.schedule });
  }

  componentWillReceiveProps = (nextProps) => {
    if (!objectEquals(nextProps.schedule, this.props.schedule)) {
      this.setState({ schedule: nextProps.schedule });
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
  }

  render() {
    if (this.state.loading) {
      return <LoadingView />;
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
      />,
    ];

    return (Object.keys(this.props.schedule).length > 0)
      ? (
        <div style={{ height: '100%' }}>
          <CalendarContainer
            schedule={ this.state.schedule }
            onClassClick={ this.onClassClick }
            onClearSchedule={ this.onClearScheduleClick }
            onImportTerm={ this.onOpenDialog }
            onUpdatePrivacy={ this.onUpdatePrivacy }
            isBrowsing={ this.state.isBrowsing }
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
