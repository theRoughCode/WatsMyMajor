import React from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';
import Trash from './Trash';

const styles = {
  container: {
    position: 'fixed',
    right: 0,
    paddingTop: 30,
    paddingRight: 30,
    display: 'flex',
    flexDirection: 'column',
  },
};

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
  cartCourses: PropTypes.array,
  onClearCart: PropTypes.func,
};

MyCourseSideBar.defaultProps = {
  cartCourses: [],
  onClearCart: () => {},
};

export default MyCourseSideBar;
