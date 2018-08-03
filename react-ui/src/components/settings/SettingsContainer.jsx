import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserIcon from 'material-ui/svg-icons/action/face';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import SettingsBoard from './SettingsBoard';
import { editSettings } from '../../actions';

const styles = {
  settingsContainer: {
    margin: '50px auto',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
  },
};

const SettingsContainer = ({
  username,
  name,
  email,
  onEditSettings
}) => (
  <div style={ styles.settingsContainer }>
    <SettingsBoard
      username={ username }
      fields={ [
        {
          name: 'name',
          Icon: UserIcon,
        },
        {
          name: 'email',
          Icon: EmailIcon,
        }
      ] }
      values={{ name, email }}
      onEditSettings={ onEditSettings }
    />
  </div>
);

SettingsContainer.propTypes = {
  username: PropTypes.string.isRequired,
  onEditSettings: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user }) => ({
  username: user.username,
  name: user.name,
  email: user.email,
});

const mapDispatchToProps = dispatch => {
  return {
    onEditSettings: (username, user) => dispatch(editSettings(username, user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
