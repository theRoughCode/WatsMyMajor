import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CalendarContainer from './CalendarContainer';
import ParserInstructions from '../tools/ParserInstructions';

const stepContents = [
  {
    button: 'Log in to Quest',
    text: <p>Log in to your Quest account <a href="https://quest.pecs.uwaterloo.ca/psp/SS" target="_blank">here</a>.</p>
  },
  {
    button: 'Enroll',
    text: <p>Click on the <b>Enroll</b> tab.</p>
  },
  {
    button: 'Select all and copy text',
    text: <p>Select all, and copy EVERYTHING!!</p>
  },
];

export default class Schedule extends Component {
  state = {
    text: '',
    submitted: false,
  };

  onChange = (text) => this.setState({ text });

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
  }

  render() {
    return (this.state.submitted)
      ? <CalendarContainer text={this.state.text} />
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
