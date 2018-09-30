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
import { purple } from '../../../constants/Colours';


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
    width: '100%',
    whiteSpace: 'nowrap',
    overflowX: 'scroll',
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

const termStr = (term) => {
  const termRegex = /1([1-2][0-9])(1|5|9)/;
  const [ year, month ] = term.match(termRegex).slice(1);
  let season = '';
  switch (month) {
  case '1':
    season = 'Winter';
    break;
  case '5':
    season = 'Spring';
    break;
  case '9':
    season = 'Fall';
    break;
  default:
    season = '';
  }
  return `${season} 20${year}`;
};


const CourseClassList = ({
  expandClass,
  term,
  classes,
}) => (
  <div style={ styles.container }>
    <div style={ styles.header }>
      <span>{ termStr(term) }</span>
    </div>
    <div style={ styles.scrollable }>
      <Paper zDepth={ 1 } style={ styles.paper }>
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
      </Paper>
    </div>
  </div>
);

CourseClassList.propTypes = {
  expandClass: PropTypes.func.isRequired,
  term: PropTypes.string.isRequired,
  classes: PropTypes.array.isRequired
};

export default CourseClassList;
