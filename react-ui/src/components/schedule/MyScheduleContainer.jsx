import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CalendarContainer from './CalendarContainer';
import ParserInstructions from '../tools/ParserInstructions';
import { addToSchedule, clearSchedule } from '../../actions';
import { objectEquals } from '../../utils/arrays';

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

class ScheduleContainer extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    schedule: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onUploadSchedule: PropTypes.func.isRequired,
    onClearSchedule: PropTypes.func.isRequired,
  };

  state = {
    text: '',
    schedule: this.props.schedule,
    submitted: false,
    importDialogOpen: false,
  };

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

  render() {
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
  schedule: mySchedule,
});

const mapDispatchToProps = dispatch => ({
  onUploadSchedule: (username, text) => dispatch(addToSchedule(username, text)),
  onClearSchedule: (username) => dispatch(clearSchedule(username)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleContainer));
