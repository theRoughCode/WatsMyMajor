import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import 'stylesheets/InstructionsView.css';

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
      maxIndex: props.stepContents.length + 1,
      stepContents: props.stepContents
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Add parser box
    const stepContents = this.props.stepContents.concat([{
      button: 'Submit for parsing',
    }]);

    this.setState({ stepContents });
  }

  handleNext() {
    const { stepIndex } = this.state;
    if (stepIndex < this.state.stepContents.length - 1) {
      this.setState({ stepIndex: stepIndex + 1 });
    }
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  getStepContent(stepIndex) {
    if (stepIndex < this.state.maxIndex - 1) {
      return this.state.stepContents[stepIndex].text;
    } else {
      return (
        <div className="instructions-form">
          <p>Paste your copied text below:</p>
          <form>
            <textarea
              rows="4"
              cols="100"
              type="text"
              value={ this.state.text }
              onChange={ this.handleChange }
            />
          </form>
        </div>
      );
    }
  }

  handleChange(e) {
    const text = e.target.value;
    this.props.onChange(text);
    this.setState({ text });
  }

  render() {
    const { stepIndex, stepContents } = this.state;

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
                onClick={ this.handlePrev }
                style={{ marginRight: 12 }}
              />
              <RaisedButton
                label="Next"
                disabled={ stepIndex === stepContents.length - 1 }
                primary
                onClick={ this.handleNext }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
