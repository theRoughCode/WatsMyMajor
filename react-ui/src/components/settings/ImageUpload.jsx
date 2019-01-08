import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import AvatarIcon from 'material-ui/svg-icons/action/account-circle';
import Grid from '@material-ui/core/Grid';
import { getCookie } from 'utils/cookies';
import { lightGreen2, red } from 'constants/Colours';

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
    width: 250,
    display: 'inline-block',
    paddingTop: 10,
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  error: {
    height: 16,
    fontSize: 13,
    marginTop: 3,
    color: red,
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
    profileURL: PropTypes.string,
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
    // reader.onabort = () => console.log('File upload aborted.');
    // reader.onerror = () => console.log('File upload failed.');

    reader.readAsDataURL(file);
  }

  onDelete = async (_) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(`/server/users/remove/profile/${this.props.username}`, {
        method: 'POST',
        headers: {
          "x-secret": process.env.REACT_APP_SERVER_SECRET,
          'authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
        }
      });

      if (!response.ok) {
        toast.error('Failed to delete image.  Please contact an administrator.');
        this.setState({ loading: false });
        return;
      }

      const user = await response.json();
      this.props.onChangeImage(this.props.username, user);
      this.setState({ loading: false });
      this.closeDialog();
      toast.success('Successfully removed image!');
    } catch(err) {
      console.error(err);
      this.setState({ loading: false });
    }
  }

  onSubmit = async (_, isEaster = false) => {
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
        toast.error('Failed to upload image.  Please contact an administrator.');
        this.setState({ loading: false });
        return;
      }

      const user = await response.json();
      this.props.onChangeImage(this.props.username, user);
      this.setState({ loading: false });
      this.closeDialog();
      toast.success('Image upload success!');
    } catch(err) {
      console.error(err);
      this.setState({ loading: false });
    }
  }

  onUnlockEaster = () => this.onSubmit(null, true);

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={ this.closeDialog }
        disabled={ this.state.loading }
      />,
      <FlatButton
        label="Unlock Easter Egg"
        onClick={ this.onUnlockEaster }
        style={{ display: 'none' }}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={ this.onSubmit }
        disabled={ this.state.file.length === 0 }
      />,
    ];

    const dialogBody = (this.state.loading)
      ? (
        <div style={ styles.loaderContainer }>
          <CircularProgress
            size={ 80 }
            thickness={ 5 }
            style={ styles.loader }
          />
        </div>
      )
      : (
        <div>
          <div>
            <Grid
              container
              direction="row"
              justify="flex-start"
              spacing={ 8 }
            >
              <Grid item>
                <RaisedButton
                  label="Choose an Image"
                  labelPosition="before"
                  backgroundColor={ lightGreen2 }
                  containerElement="label"
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={ styles.input }
                    onChange={ this.onUpload }
                  />
                </RaisedButton>
              </Grid>
              <Grid item>
                <RaisedButton
                  label="Remove Avatar"
                  backgroundColor={ lightGreen2 }
                  containerElement="label"
                  onClick={ this.onDelete }
                  disabled={ !this.props.profileURL || this.props.profileURL === "" }
                />
              </Grid>
            </Grid>
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
          title="Change Avatar"
          actions={ actions }
          modal
          open={ this.state.open }
          contentStyle={ styles.dialog }
        >
          { dialogBody }
        </Dialog>
      </div>
    );
  }

}
