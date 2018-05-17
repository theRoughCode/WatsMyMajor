import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import '../../stylesheets/InstructionsView.css';

const styles = {
  stepperInfo: {
    height: '100%'
  }
};

export default class ParserInstructions extends Component {
  static propTypes = {
    stepContents: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      submitted: false,
      stepIndex: 0,
      stepContents: props.stepContents
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // Add parser box
    this.state.stepContents.push({
      button: 'Submit for parsing',
      text: (
        <div className="instructions-form">
          <p>Paste your copied text below:</p>
          <form>
            <textarea rows="4" cols="100" type="text" onChange={ this.handleChange } />
          </form>
        </div>
      )
    });
  }

  handleNext() {
    const { stepIndex } = this.state;
    if (stepIndex < this.state.stepContents.length - 1) {
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
    return this.state.stepContents[stepIndex].text;
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  render() {
    const { stepIndex, submitted, text, stepContents } = this.state;
    const nextButtonText = (stepIndex === stepContents.length - 1) ? 'Submit' : 'Next';

    const formView = (
      <div className="instructions">
        <Stepper linear={ false } activeStep={ stepIndex }>
          {
            stepContents.map(({ button }, stepIndex) => (
              <Step key={ stepIndex }>
                <StepButton onClick={ () => this.setState({ stepIndex }) }>
                  { button }
                </StepButton>
              </Step>
            ))
          }
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

    return (submitted)
      ? React.cloneElement(this.props.child, { text })
      : formView;
  }

}
