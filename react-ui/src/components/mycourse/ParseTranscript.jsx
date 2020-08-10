import React from 'react';
import PropTypes from 'prop-types';
import ParserInstructions from '../tools/ParserInstructions';

const ParseTranscript = ({ onChange }) => {
  const stepContents = [
    {
      button: 'Log in to Quest',
      text: <p>Log in to your Quest account <a href="https://quest.pecs.uwaterloo.ca/psp/SS" target="_blank" rel="noopener noreferrer">here</a>.</p>,
    },
    {
      button: 'My Academics',
      text: <p>Click on the <b>My Academics</b> tab.</p>,
    },
    {
      button: 'View Unofficial Transcript',
      text: <p>Under the <b>Unofficial Transcript</b> tab, select <b>Undergrad Unofficial</b> as the <b>Report Type</b>, and click <b>View Report</b>.</p>,
    },
    {
      button: 'Select all and copy text',
      text: (
        <div style={{ textAlign: 'center' }}>
          <p>
            Select and copy everything
          </p>
          <p>
            <i>
              If that doesn't work, right-click, select "Print", and copy everything within the preview screen.
            </i>
          </p>
        </div>
      ),
    },
  ];

  return <ParserInstructions stepContents={stepContents} onChange={onChange} />;
};

ParseTranscript.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ParseTranscript;
