import React from 'react';
import logo from 'images/logo.png';

const styles = {
  bigContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  smallContainer: {
    margin: 'auto',
    width: 700,
    height: '60%',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: 60,
    height: 60,
    margin: '20px auto',
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    marginBottom: 50,
  },
};

// TODO: Include graphics/make prettier
const EmailSent = () => (
  <div style={ styles.bigContainer }>
    <div style={ styles.smallContainer }>
      <img src={ logo } alt="logo" style={ styles.logo } />
      <span style={ styles.title }>Verification Email Sent!</span>
      <span style={ styles.text }>A verification email has been sent to your provided email.  Please use the link provided in the email to verify your account before you can use the app!</span>
      <span>Click <a href="/">here</a> to return to the login screen.</span>
    </div>
  </div>
);


export default EmailSent;
