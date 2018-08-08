import React from 'react';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';
import TermBoard from './TermBoard';

const NUM_PER_ROW = 3;
const styles = {
	board: {
		width: '100%',
		display: 'flex',
		overflow: 'auto',
	},
}

const TermRow = ({
  rowNumber,
  courseList,
  onClearBoard,
  onRenameBoard,
  onDeleteBoard,
  onUpdateCourses,
}) => (
  <Droppable
    droppableId={ `row/${rowNumber}` }
    type={ DragTypes.COLUMN }
    direction="horizontal"
    ignoreContainerClipping={true}
  >
    {(provided, snapshot) => (
      <div
        ref={ provided.innerRef }
        {...provided.droppableProps}
        style={ styles.board }
      >
        {
          courseList.map(({ term, courses }, index) => {
            return (
              <Draggable
                draggableId={ `term/${rowNumber}/${index}` }
                type={ DragTypes.COLUMN }
                index={ index }
                key={ index }
              >
                {(provided, snapshot) => (
                  <TermBoard
                    index={ String(index + rowNumber * NUM_PER_ROW) }
                    boardHeader={ term }
                    courses={ courses }
                    provided={ provided }
                    snapshot={ snapshot }
                    onClearBoard={ () => onClearBoard(index) }
                    onRenameBoard={ () => onRenameBoard(index) }
                    onDeleteBoard={ () => onDeleteBoard(index) }
                    onUpdateCourses={ () => onUpdateCourses(index) }
                  />
                )}
              </Draggable>
            );
          })
        }
        { provided.placeholder }
      </div>
    )}
  </Droppable>
);

TermRow.propTypes = {
  rowNumber: PropTypes.number.isRequired,
  courseList: PropTypes.array.isRequired,
  onClearBoard: PropTypes.func.isRequired,
  onRenameBoard: PropTypes.func.isRequired,
  onDeleteBoard: PropTypes.func.isRequired,
  onUpdateCourses: PropTypes.func.isRequired,
}

export default TermRow;
