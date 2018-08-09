import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';

const styles = {
  tableRow: (isGreyed) => ({
		cursor: 'pointer',
    backgroundColor: (isGreyed) ? '#ededed' : 'inherit',
	}),
};

const ClassRow = ({
  classData,
  selected,
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

  const isGreyed = isTBA || isCancelled || isClosed || enrollmentCap === enrollmentTotal;
  const tbaText = (isTBA) ? ' (TBA)' : '';

  return (
    <TableRow
      hoverable={ !selected }
      onClick={ onClickHandler }
      selected={ selected }
      style={ styles.tableRow(isGreyed) }>
      <TableRowColumn>{ section + tbaText }</TableRowColumn>
      <TableRowColumn>{ classNumber }</TableRowColumn>
      <TableRowColumn>{ campus }</TableRowColumn>
      <TableRowColumn>{ enrollmentTotal }/{ enrollmentCap }</TableRowColumn>
      <TableRowColumn><b>{ weekdays.join(', ') }</b> { time }</TableRowColumn>
      <TableRowColumn>{ location }</TableRowColumn>
      <TableRowColumn>{ instructor }</TableRowColumn>
    </TableRow>
  );
};

ClassRow.propTypes = {
  classData: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onClickHandler: PropTypes.func.isRequired
};

export default ClassRow;
