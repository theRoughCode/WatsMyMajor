import React, { Component } from 'react';
import CalendarContainer from './CalendarContainer';
import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import '../../stylesheets/ScheduleView.css';

const styles = {
  stepperInfo: {
    height: '100%'
  }
};

export default class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      submitted: false,
      stepIndex: 0
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleNext() {
    const { stepIndex } = this.state;
    if (stepIndex < 3) {
      this.setState({ stepIndex: stepIndex + 1 });
    } else {
      this.setState({ submitted: true });
    }
  };

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <p>Log in to your Quest account <a href="https://quest.pecs.uwaterloo.ca/psp/SS" target="_blank">here</a></p>;
      case 1:
        return <p>Under the <b>Academics</b> tab, click <b>Enroll</b></p>;
      case 2:
        return <p>Right-click, select all, and copy EVERYTHING!!</p>;
      case 3:
        return (
          <div className="schedule-form">
            <p>Paste your copied text below:</p>
            <form>
              <textarea rows="4" cols="100" type="text" onChange={ this.handleChange } />
            </form>
          </div>
        );
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  render() {
    const { stepIndex, submitted, text } = this.state;
    const nextButtonText = (stepIndex === 3) ? 'Submit' : 'Next';

    const formView = (
      <div className="schedule">
        <Stepper linear={ false } activeStep={ stepIndex }>
          <Step>
            <StepButton onClick={ () => this.setState({ stepIndex: 0 }) }>
              { "Log in to Quest" }
            </StepButton>
          </Step>
          <Step>
            <StepButton onClick={ () => this.setState({ stepIndex: 1 }) }>
              { "Enroll" }
            </StepButton>
          </Step>
          <Step>
            <StepButton onClick={ () => this.setState({ stepIndex: 2 }) }>
              { "Select all and copy text" }
            </StepButton>
          </Step>
          <Step>
            <StepButton onClick={ () => this.setState({ stepIndex: 3 }) }>
              { "Submit for parsing" }
            </StepButton>
          </Step>
        </Stepper>
        <div style={ styles.stepperInfo }>
          { this.getStepContent(stepIndex) }
          <div style={{ marginTop: 12 }}>
            <FlatButton
              label="Back"
              disabled={ stepIndex === 0 }
              onClick={this.handlePrev}
              style={{ marginRight: 12 }}
            />
            <RaisedButton
              label={ nextButtonText }
              primary={ true }
              onClick={ this.handleNext }
            />
          </div>
        </div>
      </div>
    );

    return (submitted) ? <CalendarContainer text={ text } /> : formView;
  }

}
