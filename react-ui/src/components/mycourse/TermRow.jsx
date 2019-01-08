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
}

const TermRow = ({
  rowNumber,
  courseList,
  onClearBoard,
  onRenameBoard,
  onDeleteBoard,
  onUpdateCourses,
  showCart,
  cart,
  onClearCart,
}) => (
  <Droppable
    droppableId={ `row/${rowNumber}` }
    type={ DragTypes.COLUMN }
    direction="horizontal"
    ignoreContainerClipping
  >
    { (provided, snapshot) => (
      <div
        ref={ provided.innerRef }
        { ...provided.droppableProps }
        style={ styles.board }
      >
        { showCart && (
          <TermBoard
            term="Cart"
            courses={ cart }
            isCart
            onClearBoard={ onClearCart }
          />
        ) }
        {
          courseList.map(({ term, level, courses }, index) => {
            // Accounts for row number
            const offsetIndex = index + rowNumber * NUM_PER_ROW;
            return (
              <Draggable
                draggableId={ `term/${rowNumber}/${index}` }
                type={ DragTypes.COLUMN }
                index={ index }
                key={ index }
              >
                { (provided, snapshot) => (
                  <TermBoard
                    index={ String(offsetIndex) }
                    term={ term }
                    level={ level }
                    courses={ courses }
                    provided={ provided }
                    snapshot={ snapshot }
                    onClearBoard={ () => onClearBoard(offsetIndex) }
                    onRenameBoard={ (rename, relevel) => onRenameBoard(offsetIndex, rename, relevel) }
                    onDeleteBoard={ () => onDeleteBoard(offsetIndex) }
                    onUpdateCourses={ (courses) => onUpdateCourses(offsetIndex, courses) }
                  />
                ) }
              </Draggable>
            );
          })
        }
        { provided.placeholder }
      </div>
    ) }
  </Droppable>
);

TermRow.propTypes = {
  rowNumber: PropTypes.number.isRequired,
  courseList: PropTypes.array.isRequired,
  onClearBoard: PropTypes.func.isRequired,
  onRenameBoard: PropTypes.func.isRequired,
  onDeleteBoard: PropTypes.func.isRequired,
  onUpdateCourses: PropTypes.func.isRequired,
  showCart: PropTypes.bool,
  cart: PropTypes.array,
  onClearCart: PropTypes.func,
}

TermRow.defaultProps = {
  showCart: false,
  cart: [],
  onClearCart: () => {},
};

export default TermRow;
