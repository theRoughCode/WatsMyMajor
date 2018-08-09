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


const styles = {
	paper: {
		display: 'inline-block',
		width: 'auto'
	},
	table: {
		display: 'inline-block',
		height: 'auto',
		width: 'auto',
		tableLayout: 'auto'
	},
	tableHeader: {
		fontSize: '15px',
		fontWeight: '500',
		backgroundColor: 'rgb(54, 65, 80)',
		color: 'white'
	},
};

// TODO: Make this more dynamic
const termStr = (term) => {
	switch(term) {
		case '1179': return 'Fall 2017';
		case '1181': return 'Winter 2018';
		case '1185': return 'Spring 2018';
		case '1189': return 'Fall 2018';
		default: return '';
	}
};


const CourseClassList = (props) => {
	const {
		expandClass,
		term,
		classes,
		selectedClassIndex
	} = props;

	return (
		<div className="course-class-list">
			<div className="course-class-list-header">
				<span>{ termStr(term) }</span>
			</div>
			<Paper zDepth={ 1 } style={ styles.paper }>
				<Table
					className="course-class-list-table"
					style={ styles.table }
					headerStyle={{ height: 0 }}
					>
					<TableBody displayRowCheckbox={false}>
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
									selected={ index === selectedClassIndex }
									onClickHandler={ () => expandClass(classData, index) } />
							))
						}
					</TableBody>
				</Table>
			</Paper>
		</div>
	);
};

CourseClassList.propTypes = {
	expandClass: PropTypes.func.isRequired,
	selectedClassIndex: PropTypes.number.isRequired,
	term: PropTypes.string.isRequired,
	classes: PropTypes.array.isRequired
};

export default CourseClassList;
