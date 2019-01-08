import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FacebookIcon from '../tools/FacebookIcon';
import { darkRed } from 'constants/Colours';

const styles = {
  boardContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    marginTop: 50,
    width: '100%',
  },
  boardHeaderContainer: {
    marginBottom: 10
  },
  boardText: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 500,
    float: 'left',
  },
  boardBody: {
    padding: '10px 0',
  },
  button: {
    color: 'white',
  },
};

export default class LinkFacebook extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    isLinked: PropTypes.bool.isRequired,
    onLink: PropTypes.func.isRequired,
    onUnlink: PropTypes.func.isRequired,
  };

  onFBLink = async (response) => {
    const { id, picture } = response;
    const hasPicture = Boolean(picture && picture.data && picture.data.url);
    this.props.onLink(this.props.username, id, hasPicture);
  }

  onFBUnlink = () => this.props.onUnlink(this.props.username);

  render() {
    const { isLinked } = this.props;

    const facebookButton = (isLinked)
      ? (
        <RaisedButton
          label="Unlink Facebook"
          onClick={ this.onFBUnlink }
          labelStyle={ styles.button }
          backgroundColor={ darkRed }
          icon={ <FacebookIcon style={ styles.button } /> }
        />
      )
      : (
        <FacebookLogin
          appId={ process.env.REACT_APP_FACEBOOK_APP_ID }
          fields="picture"
          callback={ this.onFBLink }
          render={ renderProps => (
            <RaisedButton
              label="Link Facebook"
              onClick={ renderProps.onClick }
              labelStyle={ styles.button }
              backgroundColor="#3b5998"
              icon={ <FacebookIcon /> }
            />
          ) }
        />
      );

    return (
      <div style={ styles.boardContainer }>
        <div style={ styles.boardHeaderContainer }>
          <span style={ styles.boardText }>Social Accounts</span>
        </div>
        <Paper style={ styles.boardBody }>
          { facebookButton }
        </Paper>
      </div>
    );
  }
}
