import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';
import CourseCard from './CourseCard';
import { DragDropContext } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';


const renderTerms = (courseList) => {
	return Object.entries(courseList).map((kv, index) => {
		const termNumber = kv[0];
		const { term, year, courses } = kv[1];

		return (
			<TermBoard
				key={index}
				termNumber={termNumber}
				term={term}
				year={year}
				courses={courses}
				/>
		);
	});
}

// Reorder courses in term board
const reorder = (list, source, dest) => {
	const sourceTerm = list[source.droppableId];
	const destTerm = list[dest.droppableId];

	const sourceIndex = source.index;
	const destIndex = dest.index;

	const [ course ] = sourceTerm.courses.splice(sourceIndex, 1);
	destTerm.courses.splice(destIndex, 0, course);

	list[source.droppableId] = sourceTerm;
	list[dest.droppableId] = destTerm;

  return list;
};


export default class CourseBoard extends Component {

	static propTypes = {
		courseList: PropTypes.object.isRequired,
		updateCourseHandler: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		const { courseList, updateCourseHandler } = props;

		for (let term in courseList) {
			courseList[term].courses = courseList[term].courses.map(course => {
				course['id'] = uuidv4();
				return course;
			});
		}

		this.state = {
			courseList
		};

		this.onDragEnd = this.onDragEnd.bind(this);
		this.updateCourseHandler = updateCourseHandler;
	}

	onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

		const courseList = reorder(
			this.state.courseList,
			result.source,
			result.destination
		);

		this.updateCourseHandler(courseList);
  }

	render() {
		const { term, year, courses } = this.state.courseList['1A'];
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className="course-board">
					{renderTerms(this.state.courseList)}
				</div>
			</DragDropContext>
		);
	}

}
