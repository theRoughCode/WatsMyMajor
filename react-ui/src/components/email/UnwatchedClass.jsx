import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    marginTop: 30,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    marginBottom: 50,
  },
};

// TODO: Include graphics/make prettier
export default class UnwatchedClass extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  state = {
    info: {},
    error: false,
    loading: true,
  };

  async componentDidMount() {
    const { search } = this.props.location;
    /* eslint-disable no-useless-escape */
    const tokenRegex = /.*(\?|\&)token=([^&]*)(\&.*|$)/;
    const matchArr = search.match(tokenRegex);
    if (matchArr == null || matchArr.length < 3) return;
    const token = matchArr[2];

    const response = await fetch(`/server/email/verify/unwatch?token=${token}`, {
      headers: {
        "x-secret": process.env.REACT_APP_SERVER_SECRET
      }
    });
    if (!response.ok) {
      this.setState({ error: true, loading: false });
      return;
    }
    const info = await response.json();
    this.setState({ info, loading: false });
  }

  render() {
    if (this.state.loading) return null;
    const { classNum, subject, catalogNumber } = this.state.info;

    // TODO: Add graphics to verification error message
    const view = (this.state.error)
      ? (
        <span style={ styles.error }>
          Failed to unwatch class.  Please contact an administrator.<br />
          Click <a href="/">here</a> to return to the home screen.
        </span>
      )
      : (
        <div style={ styles.bigContainer }>
          <div style={ styles.smallContainer }>
            <img src={ logo } alt="logo" style={ styles.logo } />
            <span style={ styles.title }>Success!</span>
            <span style={ styles.subtitle }>{ `You have unwatched class ${classNum} (${subject} ${catalogNumber}).` }</span>
            <span>Click <a href="/">here</a> to return to the home screen.</span>
          </div>
        </div>
      );

    return (
      <div style={ styles.bigContainer }>
        <div style={ styles.smallContainer }>
          { view }
        </div>
      </div>
    );
  }
}
