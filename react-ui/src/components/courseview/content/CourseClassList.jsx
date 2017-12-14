import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import {
	Table,
	TableBody,
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
	},
	tableRow: {
		cursor: 'pointer'
	}
};

class Row extends Component {
	static propTypes = {
		courseObj: PropTypes.object.isRequired,
		selected: PropTypes.bool.isRequired,
		onClickHandler: PropTypes.func.isRequired
	};

	render() {
		const {
			section,
			classNumber,
			campus,
			attending,
			enrollmentCap,
			startTime,
			endTime,
			location,
			instructor
		} = this.props.courseObj;

		return (
			<TableRow
				hoverable={!this.props.selected}
				onClick={() => this.props.onClickHandler()}
				selected={this.props.selected}
				style={styles.tableRow}>
				<TableRowColumn>{section}</TableRowColumn>
				<TableRowColumn>{classNumber}</TableRowColumn>
				<TableRowColumn>{campus}</TableRowColumn>
				<TableRowColumn>{attending}/{enrollmentCap}</TableRowColumn>
				<TableRowColumn>{startTime} - {endTime}</TableRowColumn>									<TableRowColumn>{location}</TableRowColumn>
				<TableRowColumn>{instructor}</TableRowColumn>
			</TableRow>
		)
	}
}


const CourseClassList = (props) => {
	const { expandCourseHandler, classList, selectedClassIndex } = props;

	return (
		<div className="course-class-list">
			<div className="course-class-list-header">
				<span>Winter 2017</span>
			</div>
			<Paper zDepth={1} style={styles.paper}>
				<Table
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
						{classList.map((courseObj, index) => (
							<Row
								key={index}
								courseObj={courseObj}
								selected={index === selectedClassIndex}
								onClickHandler={() => expandCourseHandler(courseObj, index)} />
						))}
					</TableBody>
				</Table>
			</Paper>
		</div>
	);
};

CourseClassList.propTypes = {
	expandCourseHandler: PropTypes.func.isRequired,
	selectedClassIndex: PropTypes.number.isRequired,
	classList: PropTypes.array.isRequired
};

export default CourseClassList;
