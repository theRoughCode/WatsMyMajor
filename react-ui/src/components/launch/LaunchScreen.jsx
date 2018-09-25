import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { green, white } from '../../constants/Colours';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  innerContainer: {
    display: 'flex',
    margin: 'auto',
    width: '90%',
    height: 'fit-content',
  },
  leftContainer: {
    width: '50%',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  title: {
    fontSize: 30,
    fontWeight: 350,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 300,
  },
  buttonContainer: {
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    color: white,
  },
  rightContainer: {
    width: '50%',
  }
};

const LaunchScreen = ({ history }) => {
  const goToLogin = () => history.push('/login');
  return (
    <div style={ styles.container }>
      <div style={ styles.innerContainer }>
        <div style={ styles.leftContainer }>
          <div style={ styles.infoContainer }>
            <div style={ styles.title }>
              Get the most out of your university career
            </div>
            <span style={ styles.subtitle }>
              WatsMyMajor simplifies planning your courses and majors.
            </span>
            <div style={ styles.buttonContainer }>
              <RaisedButton
                label="Get Started"
                backgroundColor={ green  }
                style={ styles.loginButton }
                labelStyle={ styles.loginText }
                onClick={ goToLogin }
                type="submit"
              />
            </div>
          </div>
        </div>
        <div style={ styles.rightContainer }>
        </div>
      </div>
    </div>
  );
}

export default LaunchScreen;
