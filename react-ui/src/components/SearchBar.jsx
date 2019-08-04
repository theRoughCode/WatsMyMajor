import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBar from 'material-ui-search-bar';

async function fetchQuery(query, maxNumberOfResults, courseOnly) {
  try {
    const response = await fetch(`/server/courses/query/${query}/${maxNumberOfResults}?courseOnly=${courseOnly}`, {
      headers: {
        'x-secret': process.env.REACT_APP_SERVER_SECRET
      }
    });
    if (response.status !== 200) {
      console.error('Looks like there was a problem. Status Code: ' +
        response.status);
      return [];
    }
    return await response.json();
  } catch(err) {
    console.error(err);
    return [];
  }
}

class AppSearchBar extends Component {

  static propTypes = {
    style: PropTypes.object,
    onResult: PropTypes.func.isRequired,
    courseOnly: PropTypes.bool,
    expandSearch: PropTypes.func,
    closeSearch: PropTypes.func,
    popoverProps: PropTypes.object,
  };

  static defaultProps = {
    style: {
      marginTop: '5px',
      maxWidth: 800,
      whitespace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    expandSearch: () => {},
    closeSearch: () => {},
    courseOnly: false,
    popoverProps: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      query: '',
      courseOnly: props.courseOnly,
    };

    this.onClick = this.onClick.bind(this);
    this.querySearch = this.querySearch.bind(this);
    this.searchCourse = this.searchCourse.bind(this);
  }

  onClick() {
    this.setState({ dataSource: [], query: '' });
    this.props.expandSearch();
  }

  // Find all courses and profs that match the queried string
  async querySearch(query) {
    if (!query) return;

    this.setState({ query });

    const maxNumberOfResults = 5;
    let dataSource = await fetchQuery(query, maxNumberOfResults, this.state.courseOnly);
    dataSource = dataSource.map(result => {
      const { subject, catalogNumber, title, name } = result;
      if (name != null) return name;
      return `${subject} ${catalogNumber} - ${title}`;
    });

    this.setState({ dataSource });
  }

  async searchCourse(query) {
    if (!query) return;

    const result = await fetchQuery(query, 1, this.state.courseOnly);
    if (result.length === 0) return;
    this.props.onResult(result[0]);
  }

  render() {
    return (
      <SearchBar
        ref={ (input) => this.searchBar = input }
        hintText=""
        name="searchCourses"
        placeholder="Search for courses or profs"
        dataSource={ this.state.dataSource }
        filter={ (searchValue, key) => searchValue.length }
        onChange={ this.querySearch }
        onClick={ this.onClick }
        onRequestSearch={ () => null }
        onNewRequest={ this.searchCourse }
        style={ this.props.style }
        value={ this.state.query }
        onBlur={ this.props.closeSearch }
        popoverProps={ this.props.popoverProps }
      />
    );
  }
}



export default AppSearchBar;
