import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';

const styles = {
  tableRow: (isGreyed) => ({
    cursor: 'pointer',
    backgroundColor: (isGreyed) ? '#e5e5e5' : 'inherit',
  }),
  classesRow: {
    height: 'auto',
    minHeight: 48,
  },
  classesContainer: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  classesLine: {
    margin: '2px auto',
  },
};

const formatClassTime = (classes) => (
  <TableRowColumn style={ styles.classesRow }>
    <div style={ styles.classesContainer }>
      {
        classes.map(({ startTime, endTime, weekdays, isTBA }, index) => {
          const time = (startTime && endTime)
            ? `${startTime} - ${endTime}`
            : 'N/A';
          if (isTBA) return 'TBA';

          if (weekdays == null) weekdays = [];
          return (
            <span key={ index } style={ styles.classesLine }>
              <b>{ weekdays.join(', ') }</b> { time }
            </span>
          );
        })
      }
    </div>
  </TableRowColumn>
);

const formatLocation = (classes) => (
  <TableRowColumn style={ styles.classesRow }>
    <div style={ styles.classesContainer }>
      {
        classes.map(({ location }, index) => <span key={ index } style={ styles.classesLine }>{ location }</span>)
      }
    </div>
  </TableRowColumn>
);

const formatInstructor = (classes) => (
  <TableRowColumn style={ styles.classesRow }>
    <div style={ styles.classesContainer }>
      {
        classes.map(({ instructor }, index) => <span key={ index } style={ styles.classesLine }>{ instructor }</span>)
      }
    </div>
  </TableRowColumn>
);

const ClassRow = ({
  classData,
  onClickHandler,
}) => {
  const {
    classNumber,
    section,
    campus,
    enrollmentCap,
    enrollmentTotal,
    isTBA,
    isCancelled,
    isClosed,
    classes
  } = classData;

  const isGreyed = isTBA || isCancelled || isClosed || enrollmentCap <= enrollmentTotal;
  const tbaText = (isTBA) ? ' (TBA)' : '';

  return (
    <TableRow
      hoverable
      onClick={ onClickHandler }
      style={ styles.tableRow(isGreyed) }
    >
      <TableRowColumn style={{ textAlign: 'center' }}>{ section + tbaText }</TableRowColumn>
      <TableRowColumn style={{ textAlign: 'center' }}>{ classNumber }</TableRowColumn>
      <TableRowColumn style={{ textAlign: 'center' }}>{ campus }</TableRowColumn>
      <TableRowColumn style={{ textAlign: 'center' }}>{ enrollmentTotal }/{ enrollmentCap }</TableRowColumn>
      { formatClassTime(classes) }
      { formatLocation(classes) }
      { formatInstructor(classes) }
    </TableRow>
  );
};

ClassRow.propTypes = {
  classData: PropTypes.object.isRequired,
  onClickHandler: PropTypes.func.isRequired
};

export default ClassRow;
