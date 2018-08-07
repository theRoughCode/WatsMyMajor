import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import AvatarIcon from 'material-ui/svg-icons/action/account-circle';
import { getCookie } from '../../utils/cookies';

const maxFileSize = 5242880; // %MB

const styles = {
  container: {
    width: '100%',
    marginTop: 20,
    display: 'flex',
  },
  dialog: {
    width: 400,
    maxWidth: 'none',
  },
  loaderContainer: {
    width: '100%',
    display: 'flex',
  },
  loader: {
    margin: 'auto',
  },
  input: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  filename: {
    width: 150,
    marginLeft: 20,
    display: 'inline-block',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  error: {
    height: 16,
    fontSize: 13,
    marginTop: 3,
    color: '#ea4d4d',
  },
  previewContainer: {
    marginTop: 20,
    display: 'flex',
  },
  preview: {
    margin: 'auto',
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: '50%',
  },
};

export default class ImageUpload extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    onChangeImage: PropTypes.func.isRequired,
  };

  state = {
    file: '',
    filename: '',
    filetype: '',
    errorMsg: '',
    open: false,
    loading: false,
  };

  openDialog = () => this.setState({ open: true });
  closeDialog = () => this.setState({ open: false, errorMsg: '', file: '', filename: '' });

  onUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    // Validate images
    if (file.size > maxFileSize) {
      this.setState({ errorMsg: "Max file size of 5MB exceeded." });
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      this.setState({ errorMsg: "Invalid file type.  Only JPG and PNG formats allowed." });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = reader.result;
      this.setState({
        errorMsg: '',
        filename: file.name,
        filetype: file.type,
        file: img
      });
    };
    reader.onabort = () => console.log('File upload aborted.');
    reader.onerror = () => console.log('File upload failed.');

    reader.readAsDataURL(file);
  }

  async onSubmit(e, isEaster = false) {
    this.setState({ loading: true });
    const requestBody = (isEaster)
      ? { easterRaph: isEaster }
      : { base64Str: this.state.file.split(',')[1], contentType: this.state.filetype };
    try {
      const response = await fetch(`/server/users/upload/profile/${this.props.username}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
          "x-secret": process.env.REACT_APP_SERVER_SECRET,
          'authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
        }
      });


      if (!response.ok) {
        alert('Failed to upload image.  Please contact an administrator.');
        this.setState({ loading: false });
        return;
      }

      const user = await response.json();
      this.props.onChangeImage(this.props.username, user);
      this.setState({ loading: false });
      this.closeDialog();
    } catch(err) {
      console.error(err);
      this.setState({ loading: false });
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={ this.closeDialog }
        disabled={ this.state.loading }
      />,
      <FlatButton
        label="Unlock Easter Egg"
        onClick={ this.onSubmit.bind(this, null, true) }
        style={{ display: 'none' }}
      />,
      <FlatButton
        label="Submit"
        primary={ true }
        onClick={ this.onSubmit.bind(this) }
        disabled={ this.state.file.length === 0 }
      />,
    ];

    const dialogBody = (this.state.loading)
      ? (
        <div style={ styles.loaderContainer }>
          <CircularProgress
            size={80}
            thickness={5}
            style={ styles.loader }
            />
        </div>
      )
      : (
        <div>
          <div>
            <RaisedButton
              label="Choose an Image"
              labelPosition="before"
              backgroundColor="#a4c639"
              containerElement="label"
            >
              <input
                type="file"
                accept="image/*"
                style={ styles.input }
                onChange={ this.onUpload }
              />
            </RaisedButton>
            <span style={ styles.filename }>{ this.state.filename }</span>
          </div>
          <span style={ styles.error }>{ this.state.errorMsg }</span>
          {
            (this.state.file !== '') && (
              <div style={ styles.previewContainer }>
                <img src={ this.state.file } style={ styles.preview } alt="preview" />
              </div>
            )
          }
        </div>
      );

    return (
      <div style={ styles.container }>
        <RaisedButton
          label="Change Avatar"
          onClick={ this.openDialog }
          containerElement="label"
          icon={ <AvatarIcon /> }
        />
        <Dialog
          title="Upload Avatar"
          actions={ actions }
          modal={ true }
          open={ this.state.open }
          contentStyle={ styles.dialog }
        >
          { dialogBody }
        </Dialog>
      </div>
    );
  }

}
