import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserIcon from 'material-ui/svg-icons/action/face';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import LockIcon from 'material-ui/svg-icons/action/lock';
import OpenLockIcon from 'material-ui/svg-icons/action/lock-open';
import ConfirmIcon from 'material-ui/svg-icons/action/done';
import SettingsBoard from './SettingsBoard';
import ImageUpload from './ImageUpload';
import { setUser, editSettings } from '../../actions';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validation';

const styles = {
  settingsContainer: {
    margin: 'auto',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
  },
};

// Returns an error object with error message
const verifyProfile = ({ name, email }) => ({
  name: validateName(name),
  email: validateEmail(email),
});

// Returns an error object with error message
const verifyPassword = ({ password, confirmPassword }) => ({
  password: validatePassword(password),
  confirmPassword: validateConfirmPassword(password, confirmPassword),
});

const SettingsContainer = ({
  username,
  name,
  email,
  onChangeImage,
  onSaveSettings
}) => (
  <div style={ styles.settingsContainer }>
    <SettingsBoard
      boardName="Profile"
      username={ username }
      fields={ [
        { name: 'name', label: 'name', Icon: UserIcon },
        { name: 'email', label: 'email', Icon: EmailIcon }
      ] }
      values={{ name, email }}
      onSaveSettings={ onSaveSettings }
      verifyFields={ verifyProfile }
    />
    <ImageUpload username={ username } onChangeImage={ onChangeImage } />
    <SettingsBoard
      boardName="Password"
      username={ username }
      fields={ [
        { name: 'oldPassword', label: 'Current Password', type: 'password', Icon: OpenLockIcon },
        { name: 'password', label: 'New Password', type: 'password', Icon: LockIcon },
        { name: 'confirmPassword', label: 'Confirm New Password', type: 'password', Icon: ConfirmIcon },
      ] }
      values={{ password: '', oldPassword: '', confirmPassword: '' }}
      onSaveSettings={
        (username, { password, oldPassword }) => onSaveSettings(username, { password, oldPassword })
      }
      verifyFields={ verifyPassword }
    />
  </div>
);

SettingsContainer.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user }) => ({
  username: user.username,
  name: user.name,
  email: user.email,
});

const mapDispatchToProps = dispatch => {
  return {
    onChangeImage: (username, user) => dispatch(setUser(username, user)),
    onSaveSettings: (username, user) => dispatch(editSettings(username, user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
