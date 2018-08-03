import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import UserIcon from 'material-ui/svg-icons/action/face';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import Field from './Field';
import { editSettings } from '../../actions';

const styles = {
  settingsContainer: {
    margin: '50px auto',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '100%',
  },
  profileHeaderContainer: {
    marginBottom: 10
  },
  profileText: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 500,
    float: 'left',
  },
  buttonContainer: {
    fontSize: 15,
    float: 'right',
  },
  buttonIcon: {
    height: 20,
    verticalAlign: 'sub',
  },
  profileBody: {
  },
};


class Settings extends Component {

  static propTypes = {
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    onEditSettings: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      profile: {
        name: props.name,
        email: props.email,
      }
    };

    this.onEdit = this.onEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  handleProfileChange(field, ev) {
    const profile = this.state.profile;
    profile[field] = ev.target.value;
    this.setState({ profile });
  }

  onEdit() {
    this.setState({ isEditing: true });
  }

  onSave(setting) {
    this.props.onEditSettings(this.props.username, this.state[setting]);
    this.setState({ isEditing: false });
  }

  onCancel() {
    this.setState({
      isEditing: false,
      profile: {
        name: this.props.name,
        email: this.props.email,
      }
    });
  }

  render() {
    const buttons = (this.state.isEditing)
      ? (
        <div style={ styles.buttonContainer }>
          <RaisedButton
            label="Save"
            labelPosition="before"
            primary
            icon={ <SaveIcon style={ styles.buttonIcon } /> }
            onClick={ this.onSave.bind(this, 'profile') }
          />
          <RaisedButton
            label="Cancel"
            labelPosition="before"
            backgroundColor="#e84a4a"
            icon={ <CancelIcon style={ styles.buttonIcon } /> }
            style={{ marginLeft: 10 }}
            onClick={ this.onCancel }
          />
        </div>
      )
      : (
        <RaisedButton
          label="Edit"
          labelPosition="before"
          icon={ <EditIcon style={ styles.buttonIcon } /> }
          style={ styles.buttonContainer }
          onClick={ this.onEdit }
        />
      );
    return (
      <div style={ styles.settingsContainer }>
        <div style={ styles.profileContainer }>
          <div style={ styles.profileHeaderContainer }>
            <span style={ styles.profileText }>Profile</span>
            { buttons }
          </div>
          <Paper style={ styles.profileBody }>
            <Field
              name="name"
              value={ this.state.profile.name }
              isEditing={ this.state.isEditing }
              onChange={ this.handleProfileChange.bind(this, 'name') }
              Icon={ UserIcon }
            />
            <Field
              name="email"
              value={ this.state.profile.email }
              isEditing={ this.state.isEditing }
              onChange={ this.handleProfileChange.bind(this, 'email') }
              Icon={ EmailIcon }
            />
          </Paper>
        </div>
      </div>
    );
  }

}

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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
