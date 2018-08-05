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
import LinkFacebook from './LinkFacebook';
import { setUser, editSettings, linkFacebook, unlinkFacebook } from '../../actions';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validation';

const styles = {
  settingsContainer: {
    margin: 'auto',
    marginBottom: 50,
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
  isLinked,
  onChangeImage,
  onSaveSettings,
  onLinkFacebook,
  onUnlinkFacebook,
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
    <LinkFacebook
      username={ username }
      isLinked={ isLinked }
      onLink={ onLinkFacebook }
      onUnlink={ onUnlinkFacebook }
    />
  </div>
);

SettingsContainer.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isLinked: PropTypes.bool.isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onLinkFacebook: PropTypes.func.isRequired,
  onUnlinkFacebook: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user }) => ({
  username: user.username,
  name: user.name,
  email: user.email,
  isLinked: user.facebookID != null && user.facebookID.length > 0,
});

const mapDispatchToProps = dispatch => {
  return {
    onChangeImage: (username, user) => dispatch(setUser(username, user)),
    onSaveSettings: (username, user) => dispatch(editSettings(username, user)),
    onLinkFacebook: (username, facebookID, hasFBPic) => dispatch(linkFacebook(username, facebookID, hasFBPic)),
    onUnlinkFacebook: (username) => dispatch(unlinkFacebook(username)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
