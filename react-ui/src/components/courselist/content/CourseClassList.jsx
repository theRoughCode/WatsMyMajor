import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import ClassRow from './ClassRow';
import { termNumToStr } from 'utils/courses';
import { purple } from 'constants/Colours';


const styles = {
  container: {
    maxWidth: '100%',
    marginTop: 40,
    display: 'inline-block',
    flexDirection: 'column',
    paddingLeft: 10,
  },
  header: {
    fontSize: 30,
    textAlign: 'left',
    marginBottom: 15,
  },
  scrollable: {
    width: 'fit-content',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  paper: {
    display: 'table',
    width: '100%',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    height: 'auto',
    width: '100%',
    tableLayout: 'auto'
  },
  tableHeader: {
    fontSize: '15px',
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: purple,
    color: 'white'
  },
};


const CourseClassList = ({
  expandClass,
  term,
  classes,
}) => (
  <div style={ styles.container }>
    <div style={ styles.header }>
      <span>{ termNumToStr(term) }</span>
    </div>
    <Paper zDepth={ 1 } style={ styles.scrollable }>
      <div style={ styles.paper }>
        <Table
          className="course-class-list-table"
          style={ styles.table }
          headerStyle={{ height: 0 }}
        >
          <TableBody displayRowCheckbox={ false }>
            <TableRow>
              <TableRowColumn style={ styles.tableHeader }>Section</TableRowColumn>
              <TableRowColumn style={ styles.tableHeader }>Class</TableRowColumn>
              <TableRowColumn style={ styles.tableHeader }>Campus</TableRowColumn>
              <TableRowColumn style={ styles.tableHeader }>Enrolled</TableRowColumn>
              <TableRowColumn style={ styles.tableHeader }>Time</TableRowColumn>
              <TableRowColumn style={ styles.tableHeader }>Location</TableRowColumn>
              <TableRowColumn style={ styles.tableHeader }>Instructor</TableRowColumn>
            </TableRow>
            {
              classes.map((classData, index) => (
                <ClassRow
                  key={ index }
                  classData={ classData }
                  onClickHandler={ () => expandClass(classData) } />
              ))
            }
          </TableBody>
        </Table>
      </div>
    </Paper>
  </div>
);

CourseClassList.propTypes = {
  expandClass: PropTypes.func.isRequired,
  term: PropTypes.string.isRequired,
  classes: PropTypes.array.isRequired
};

export default CourseClassList;
