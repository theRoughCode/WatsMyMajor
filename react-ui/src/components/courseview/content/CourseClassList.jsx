import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';


const styles = {
	paper: {
		display: 'inline-block',
		width: 'auto'
	},
	table: {
		display: 'inline-block',
		height: 'auto',
		width: "auto",
		tableLayout: "auto"
	},
	tableHeader: {
		fontSize: '15px',
		fontWeight: '500',
		backgroundColor: 'rgb(54, 65, 80)',
		color: 'white'
	}
};


const CourseClassList = ({ classList }) => {

	return (
		<div className="course-class-list">
			<div className="course-class-list-header">
				<span>Winter 2017</span>
			</div>
			<Paper zDepth={1} style={styles.paper}>
				<Table
					selectable={false}
					style={styles.table}
					headerStyle={{ height: 0 }}
					>
					<TableBody displayRowCheckbox={false}>
						<TableRow>
							<TableRowColumn style={styles.tableHeader}>Section</TableRowColumn>
							<TableRowColumn style={styles.tableHeader}>Class</TableRowColumn>
							<TableRowColumn style={styles.tableHeader}>Campus</TableRowColumn>
							<TableRowColumn style={styles.tableHeader}>Enrolled</TableRowColumn>
							<TableRowColumn style={styles.tableHeader}>Time</TableRowColumn>
							<TableRowColumn style={styles.tableHeader}>Location</TableRowColumn>
							<TableRowColumn style={styles.tableHeader}>Instructor</TableRowColumn>
						</TableRow>
						{classList.map((c, index) => (
							<TableRow key={index}>
								<TableRowColumn>{c.section}</TableRowColumn>
								<TableRowColumn>{c.class}</TableRowColumn>
								<TableRowColumn>{c.campus}</TableRowColumn>
								<TableRowColumn>{c.attending}/{c.enrollmentCap}</TableRowColumn>
								<TableRowColumn>{c.startTime} - {c.endTime}</TableRowColumn>									<TableRowColumn>{c.location}</TableRowColumn>
								<TableRowColumn>{c.instructor}</TableRowColumn>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
		</div>
	);
};

CourseClassList.propTypes = {
	classList: PropTypes.array.isRequired
};

export default CourseClassList;
