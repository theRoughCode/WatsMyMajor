import React from 'react';

const styles = {
  margin: 'auto',
  padding: '200px 0',
  animation: 'App-logo-spin infinite 1.5s ease',
  width: 80,
  height: 80,
};

const LoadingView = () => (
  <div className="loading course-view">
    <img src={ `${process.env.PUBLIC_URL}/images/logo.png` } style={ styles } alt="logo" />
  </div>
);

export default LoadingView;
