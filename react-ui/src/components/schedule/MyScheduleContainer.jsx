import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import CalendarContainer from './CalendarContainer';
import ParserInstructions from '../tools/ParserInstructions';
import { addToSchedule } from '../../actions';

const stepContents = [
  {
    button: 'Log in to Quest',
    text: <p>Log in to your Quest account <a href="https://quest.pecs.uwaterloo.ca/psp/SS" target="_blank">here</a>.</p>
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
		onUploadSchedule: PropTypes.func.isRequired,
	};

  state = {
    text: '',
    submitted: false,
  };

  onChange = (text) => this.setState({ text });

  onSubmit = (e) => {
    e.preventDefault();
    const { username, onUploadSchedule } = this.props;
    onUploadSchedule(username, this.state.text);
    this.setState({ submitted: true });
  }

  onClassClick = (subject, catalogNumber) => this.props.history.push(`/courses/${subject}/${catalogNumber}`);

  render() {
    return (Object.keys(this.props.schedule).length > 0)
      ? <CalendarContainer
          schedule={ this.props.schedule }
          onClassClick={ this.onClassClick }
        />
      : (
          <div style={{ marginTop: 50 }}>
            <ParserInstructions
              onChange={ this.onChange }
              stepContents={ stepContents }
            />
            <RaisedButton
              label="Submit"
              primary={ true }
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleContainer));
