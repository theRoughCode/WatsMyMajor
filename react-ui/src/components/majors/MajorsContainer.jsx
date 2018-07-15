import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChooseBoard from './ChooseBoard';

const styles = {
  block: {
    maxWidth: 250,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: 70
  },
};

const renderReqNode = ({ type, choose, courses }, index) => {
  switch (type) {
    case "choose":
      return (
        <ChooseBoard
          key={ index }
          choose={ choose }
          title={ `Choose ${choose} of:` }
          courses={ courses }
        />
      );
    case "all":
      return (
        <ChooseBoard
          key={ index }
          choose={ courses.length }
          title="Choose all of:"
          courses={ courses }
        />
      );
  }
  return null;
};

async function fetchRequirements(name) {
  const response = await fetch(`/majors/get/${name}`);
  if (!response.ok) return;
  return await response.json();
}

export default class MajorsContainer extends Component {
  state = {
    name: 'MATH-Bachelor-of-Computer-Science-1',
    url: '',
    reqs: [],
  };

  async componentDidMount() {
    const { data, url } = await fetchRequirements(this.state.name);
    this.setState({ reqs: data, url });
  }

  render() {
    return (
      <div>
        <h1><a href={ this.state.url } target="_blank">{ this.state.name }</a></h1>
        <div style={ styles.container }>
          { this.state.reqs.map(renderReqNode) }
        </div>
      </div>
    );
  }
}
