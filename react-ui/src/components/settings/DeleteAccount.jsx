import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { darkRed } from 'constants/Colours';

const styles = {
  container: {
    marginTop: 50,
  },
  button: {
    color: 'white',
  },
};

export default class DeleteAccount extends Component {
  static propTypes = {
    onDeleteAccount: PropTypes.func.isRequired,
  };

  state = {
    open: false,
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  onDelete = () => {
    this.handleClose();
    this.props.onDeleteAccount();
  }

  render() {
    const { open } = this.state;

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.handleClose }
      />,
      <FlatButton
        label="Delete"
        secondary
        onClick={ this.onDelete }
      />,
    ];

    return (
      <div style={ styles.container }>
        <RaisedButton
          label="Delete Account"
          onClick={ this.handleOpen }
          labelStyle={ styles.button }
          backgroundColor={ darkRed }
        />
        <Dialog
          title="Are you sure you want to delete your account?"
          actions={ actions }
          modal={ false }
          open={ open }
          onRequestClose={ this.handleClose }
        >
          All your current data will be lost.
        </Dialog>
      </div>
    );
  }
}
