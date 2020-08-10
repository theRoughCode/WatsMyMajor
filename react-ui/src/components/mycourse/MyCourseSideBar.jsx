import React from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';
import Trash from './Trash';

const styles = {
  container: {
    position: 'fixed',
    right: 0,
    marginTop: 30,
    marginRight: 30,
    display: 'flex',
    flexDirection: 'column',
  },
};

const MyCourseSideBar = ({ cartCourses, onClearCart, isEditing }) => (
  <div style={styles.container}>
    {isEditing && <Trash />}
    <TermBoard
      term="Cart"
      courses={cartCourses}
      isCart
      onClearBoard={onClearCart}
      isEditing={isEditing}
    />
  </div>
);

MyCourseSideBar.propTypes = {
  cartCourses: PropTypes.array,
  onClearCart: PropTypes.func,
  isEditing: PropTypes.bool.isRequired,
};

MyCourseSideBar.defaultProps = {
  cartCourses: [],
  onClearCart: () => {},
};

export default MyCourseSideBar;
