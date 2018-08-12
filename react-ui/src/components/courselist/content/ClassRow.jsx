import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';

const styles = {
  tableRow: (isGreyed) => ({
		cursor: 'pointer',
    backgroundColor: (isGreyed) ? '#e5e5e5' : 'inherit',
	}),
};

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
    startTime,
    endTime,
    weekdays,
    isTBA,
    isCancelled,
    isClosed,
    instructor,
    location,
  } = classData;

  const time = (startTime && endTime)
    ? `${startTime} - ${endTime}`
    : 'N/A';

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
      <TableRowColumn style={{ textAlign: 'center' }}><b>{ weekdays.join(', ') }</b> { time }</TableRowColumn>
      <TableRowColumn style={{ textAlign: 'center' }}>{ location }</TableRowColumn>
      <TableRowColumn style={{ textAlign: 'center' }}>{ instructor }</TableRowColumn>
    </TableRow>
  );
};

ClassRow.propTypes = {
  classData: PropTypes.object.isRequired,
  onClickHandler: PropTypes.func.isRequired
};

export default ClassRow;
