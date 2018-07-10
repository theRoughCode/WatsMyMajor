import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBar from './SideBar';

const SideBarContainer = ({ name, isLoggedIn, open }) => (
  <SideBar name={ name } isLoggedIn={ isLoggedIn } open={ open } />
);

SideBarContainer.propTypes = {
  name: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired
};

const mapStateToProps = ({ isLoggedIn, user }) => {
  const { name } = user;
  return { isLoggedIn, name };
};

export default connect(mapStateToProps, null)(SideBarContainer);
