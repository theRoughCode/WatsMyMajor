import React from 'react';
import CalendarContainer from './CalendarContainer';
import ParserInstructions from '../tools/ParserInstructions';

const Schedule = () => {
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

  return (
    <ParserInstructions stepContents={ stepContents } child={ <CalendarContainer /> } />
  )
};



export default Schedule;
