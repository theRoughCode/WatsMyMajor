import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { Droppable } from 'react-beautiful-dnd';
import TermBoard from './TermBoard';
import { DragTypes } from '../../constants/DragTypes';
import { red } from '../../constants/Colours';

const width = 200;

const styles = {
  container: {
    position: 'fixed',
    right: 0,
    marginRight: 0,
    paddingTop: 30,
    width: '22%',
    display: 'flex',
    flexDirection: 'column',
  },
  trashContainer: {
    width,
    margin: '10px auto',
    height: '100px',
    display: 'flex'
  },
  droppableContainer: isDraggingOver => ({
    width,
    height: '96px',
    display: 'flex',
    margin: 'auto',
    border: (isDraggingOver) ? '2px dashed black' : 'none',
    background: (isDraggingOver) ? red : 'inherit'
  }),
  trashIcon: {
    margin: 'auto',
    fontSize: '40px'
  }
}

const Trash = () => (
  <Paper zDepth={ 1 } style={ styles.trashContainer }>
    <Droppable
      droppableId={ 'Trash' }
      type={ DragTypes.COURSE }
    >
      { (provided, snapshot) => (
        <div
          ref={ provided.innerRef }
          style={ styles.droppableContainer(snapshot.isDraggingOver) }
        >
          <FontIcon
            className="material-icons"
            style={ styles.trashIcon }
          >
            { (snapshot.isDraggingOver)
              ? 'delete_forever'
              : 'delete'
            }
          </FontIcon>
        </div>
      )}
    </Droppable>
  </Paper>
);

const MyCourseSideBar = ({ cartCourses, onClearCart }) => (
  <div style={ styles.container }>
    <Trash />
    <TermBoard
      term="Cart"
      courses={ cartCourses }
      isCart
      onClearBoard={ onClearCart }
    />
  </div>
);

MyCourseSideBar.propTypes = {
  cartCourses: PropTypes.array.isRequired,
  onClearCart: PropTypes.func.isRequired,
};

export default MyCourseSideBar;
