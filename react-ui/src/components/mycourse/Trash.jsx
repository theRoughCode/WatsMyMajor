import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { Droppable } from 'react-beautiful-dnd';
import { DragTypes } from 'constants/DragTypes';
import { red, white } from 'constants/Colours';

const width = 200;

const styles = {
  trashContainer: {
    width,
    margin: 10,
    height: '100px',
    display: 'flex',
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
};

const mobileStyles = {
  droppableContainer: {
    width: 50,
    height: 50,
    display: 'flex',
    margin: 'auto',
  },
  trashContainer: (isDraggingOver) => ({
    width: 50,
    height: 50,
    borderRadius: 25,
    display: 'flex',
    border: (isDraggingOver) ? '2px dashed black' : 'none',
    background: (isDraggingOver) ? red : white,
  }),
};

const Trash = ({ isMobile }) => (isMobile)
  ? (
    <Droppable
      droppableId={ 'Trash' }
      type={ DragTypes.COURSE }
    >
      { (provided, snapshot) => (
        <div
          ref={ provided.innerRef }
          style={ mobileStyles.droppableContainer }
        >
          <Paper zDepth={ 1 } style={ mobileStyles.trashContainer(snapshot.isDraggingOver) }>
            <FontIcon
              className="material-icons"
              style={ styles.trashIcon }
            >
              { (snapshot.isDraggingOver)
                ? 'delete_forever'
                : 'delete'
              }
            </FontIcon>
          </Paper>
        </div>
      )}
    </Droppable>
  )
  : (
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

Trash.propTypes = {
  isMobile: PropTypes.bool,
};

Trash.defaultProps = {
  isMobile: false,
};

export default Trash;
