import React from 'react';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DragTypes } from 'constants/DragTypes';
import TermBoard from './TermBoard';

const NUM_PER_ROW = 3;
const styles = {
  board: {
    width: '100%',
    display: 'flex',
    overflowX: 'auto',
  },
};

const TermRow = ({
  rowNumber,
  courseList,
  onClearBoard,
  onRenameBoard,
  onDeleteBoard,
  onAddCourses,
  cart,
  onClearCart,
  isEditing,
  showCart,
}) => (
  <Droppable
    droppableId={`row/${rowNumber}`}
    type={DragTypes.COLUMN}
    direction="horizontal"
    ignoreContainerClipping
  >
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.droppableProps} style={styles.board}>
        {showCart && (
          <TermBoard
            term="Cart"
            courses={cart}
            onClearBoard={onClearCart}
            isEditing={isEditing}
            isCart
          />
        )}
        {courseList.map(({ term, level, courses }, index) => {
          // Accounts for row number
          const offsetIndex = index + rowNumber * NUM_PER_ROW;
          return (
            <Draggable
              draggableId={`term/${rowNumber}/${index}`}
              type={DragTypes.COLUMN}
              index={index}
              key={index}
              isDragDisabled={!isEditing}
            >
              {(provided, snapshot) => (
                <TermBoard
                  index={String(offsetIndex)}
                  term={term}
                  level={level}
                  courses={courses}
                  provided={provided}
                  snapshot={snapshot}
                  isEditing={isEditing}
                  onClearBoard={() => onClearBoard(offsetIndex)}
                  onRenameBoard={(rename, relevel) => onRenameBoard(offsetIndex, rename, relevel)}
                  onDeleteBoard={() => onDeleteBoard(offsetIndex)}
                  onAddCourses={(courses) => onAddCourses(offsetIndex, courses)}
                />
              )}
            </Draggable>
          );
        })}
        {provided.placeholder}
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
  onAddCourses: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  showCart: PropTypes.bool,
  cart: PropTypes.array,
  onClearCart: PropTypes.func,
};

TermRow.defaultProps = {
  showCart: false,
  cart: [],
  onClearCart: () => {},
};

export default TermRow;
