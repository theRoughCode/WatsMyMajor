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
		width: 'auto',
		tableLayout: 'auto'
	},
	tableHeader: {
		fontSize: '15px',
		fontWeight: '500',
		backgroundColor: 'rgb(54, 65, 80)',
		color: 'white'
	},
	tableRow: {
		cursor: 'pointer'
	},
	tableRowGrey: {
		cursor: 'pointer',
		backgroundColor: '#ededed'
	}
};

class Row extends Component {
	static propTypes = {
		classData: PropTypes.object.isRequired,
		selected: PropTypes.bool.isRequired,
		onClickHandler: PropTypes.func.isRequired
	};

	render() {
		const {
			units,
			note,
			class_number,
			section,
			campus,
			enrollment_capacity,
			enrollment_total,
			waiting_capacity,
			waiting_total,
			reserve_capacity,
			reserve_total,
			start_time,
			end_time,
			weekdays,
			is_tba,
			is_cancelled,
			is_closed,
			instructor,
			location,
			last_updated
		} = this.props.classData;

		const time = (start_time && end_time)
									? `${start_time} - ${end_time}`
									: 'N/A';

		return (
			<TableRow
				hoverable={!this.props.selected}
				onClick={() => this.props.onClickHandler()}
				selected={this.props.selected}
				style={(enrollment_capacity === enrollment_total)
					? styles.tableRowGrey
					: styles.tableRow}>
				<TableRowColumn>{section}</TableRowColumn>
				<TableRowColumn>{class_number}</TableRowColumn>
				<TableRowColumn>{campus}</TableRowColumn>
				<TableRowColumn>{enrollment_total}/{enrollment_capacity}</TableRowColumn>
				<TableRowColumn>{time}</TableRowColumn>									<TableRowColumn>{location}</TableRowColumn>
				<TableRowColumn>{instructor}</TableRowColumn>
			</TableRow>
		)
	}
}

const termStr = (term) => {
	switch(term) {
		case '1175': return 'Spring 2017';
		case '1179': return 'Fall 2017';
		case '1181': return 'Winter 2018';
		case '1185': return 'Spring 2018';
	}
};


const CourseClassList = (props) => {
	const {
		expandCourseHandler,
		term,
		classes,
		selectedClassIndex
	} = props;

	return (
		<div className="course-class-list">
			<div className="course-class-list-header">
				<span>{termStr(term)}</span>
			</div>
			<Paper zDepth={1} style={styles.paper}>
				<Table
					className="course-class-list-table"
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
						{classes.map((classData, index) => (
							<Row
								key={index}
								classData={classData}
								selected={index === selectedClassIndex}
								onClickHandler={() => expandCourseHandler(classData, index)} />
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
	term: PropTypes.string.isRequired,
	classes: PropTypes.array.isRequired
};

export default CourseClassList;
