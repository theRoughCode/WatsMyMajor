import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBar from 'material-ui-search-bar';

async function fetchQuery(query, maxNumberOfResults) {
  const response = await fetch(`/courses/query/${query}/${maxNumberOfResults}`);
  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' +
      response.status);
    return [];
  }
  const resultsArr = await response.json();
  return resultsArr.map(result => {
    const { subject, catalogNumber, title } = result;
    return `${subject} ${catalogNumber} - ${title}`;
  });
}

class AppSearchBar extends Component {

  static propTypes = {
    style: PropTypes.object,
    onResult: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {
      marginTop: '5px',
      maxWidth: 800
    }
  };

  constructor(props) {
    super(props);

    this.state = {
			dataSource: [],
      query: '',
      style: props.style
    };

    this.onClick = this.onClick.bind(this);
    this.queryForCourse = this.queryForCourse.bind(this);
    this.searchCourse = this.searchCourse.bind(this);
  }

  componentDidMount() {
    // Auto focus search bar
    this.searchBar.focus();
  }

  onClick() {
    this.setState({ dataSource: [], query: '' });
  }

  // Find all courses that match the queried string
	async queryForCourse(query) {
		if (!query) return;

    this.setState({ query });

		const maxNumberOfResults = 5;
    const dataSource = await fetchQuery(query, maxNumberOfResults);

    this.setState({ dataSource });
	}

	async searchCourse(query) {
    if (!query) return;

    const [result] = await fetchQuery(query, 1);
		const strArr = result.split(' ');
		if (strArr.length < 2) return;

    const subject = strArr[0];
    const catalogNumber = strArr[1];
		this.props.onResult(subject, catalogNumber);
	}

  render() {
    return (
      <SearchBar
        ref={ (input) => this.searchBar = input }
        hintText="Search for courses"
        dataSource={ this.state.dataSource }
        filter={ (searchValue, key) => searchValue.length }
        onChange={ this.queryForCourse }
        onClick={ this.onClick }
        onRequestSearch={ () => null }
        onNewRequest={ this.searchCourse }
        style={ this.state.style }
        value={ this.state.query }
      />
    );
  }
}



export default AppSearchBar;
