import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ChooseBoard from './ChooseBoard';

const styles = {
  header: {
    display: 'flex',
    paddingLeft: 30,
  },
  select: {
    width: 200,
    marginRight: 50,
    textAlign: 'left',
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

async function fetchRequirements(key) {
  const response = await fetch(`/majors/get/${key}`);
  if (!response.ok) return { data: [], name: '', url: '' };
  const data = await response.json() || { data: [], name: '', url: '' };
  return data;
}

async function fetchList() {
  const response = await fetch('/majors/list');
  if (!response.ok) return;
  return await response.json();
}

export default class MajorsContainer extends Component {
  state = {
    majorsList: [],
    key: '',
    name: '',
    url: '',
    reqs: [],
  };

  async componentDidMount() {
    const majorsList = await fetchList() || [];
    this.setState({ majorsList });
  }

  async handleChange(ev, index, key) {
    const { data, url } = await fetchRequirements(key);
    this.setState({ key, name: this.state.majorsList[index].name, reqs: data, url });
  }

  render() {
    if (this.state.majorsList.length === 0) return null;
    return (
      <div>
        <div style={ styles.header }>
          <SelectField
            floatingLabelText="Choose a major"
            onChange={ this.handleChange.bind(this) }
            style={ styles.select }
            value={ this.state.key }
          >
            {
              this.state.majorsList.map(({ key, name }, index) => (
                <MenuItem key={ index } value={ key } primaryText={ name } />
              ))
            }
          </SelectField>
          <h1><a href={ this.state.url } target="_blank">{ this.state.name }</a></h1>
        </div>
        <div style={ styles.container }>
          { this.state.reqs.map(renderReqNode) }
        </div>
      </div>
    );
  }
}
