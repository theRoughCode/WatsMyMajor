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
    height: '100%',
    margin: 'auto',
  },
  buttonContainer: {
    marginTop: 30,
    display: 'flex'
  }
};

export default class ParserInstructions extends Component {
  static propTypes = {
    stepContents: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      text: '',
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
    this.props.onChange(e.target.value);
  }

  render() {
    const { stepIndex, text, stepContents } = this.state;

    return (
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
          <div style={ styles.buttonContainer }>
            <div style={{ margin: 'auto' }}>
              <FlatButton
                label="Back"
                disabled={ stepIndex === 0 }
                onClick={this.handlePrev}
                style={{ marginRight: 12 }}
                />
              <RaisedButton
                label="Next"
                disabled={ stepIndex === stepContents.length - 1 }
                primary={ true }
                onClick={ this.handleNext }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
