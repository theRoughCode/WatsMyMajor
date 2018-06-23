import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBar from './SideBar';

const SideBarContainer = ({ user, open }) => (
  <SideBar user={ user } open={ open } />
);

SideBarContainer.propTypes = {
  user: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired
};

const mapStateToProps = ({ user }) => {
  return { user };
};

export default connect(mapStateToProps, null)(SideBarContainer);
