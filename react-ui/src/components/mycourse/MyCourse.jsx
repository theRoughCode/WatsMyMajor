import React from 'react';
import MyCourseContainer from './MyCourseContainer';
import ParserInstructions from '../tools/ParserInstructions';

const MyCourse = () => {
  const stepContents = [
    {
      button: 'Log in to Quest',
      text: <p>Log in to your Quest account <a href="https://quest.pecs.uwaterloo.ca/psp/SS" target="_blank">here</a>.</p>
    },
    {
      button: 'Course Selection',
      text: <p>Click on the <b>Course Selection (Undergrad Only)</b> tab.</p>
    },
    {
      button: 'Select Term',
      text: <p>Under the <b>View My Class Enrollment Results</b> tab, select the term you want.</p>
    },
    {
      button: 'Select all and copy text',
      text: <p>Select all, and copy EVERYTHING!!</p>
    },
  ];

  return (
    <ParserInstructions stepContents={ stepContents } child={ <MyCourseContainer /> } />
  );
};



export default MyCourse;
