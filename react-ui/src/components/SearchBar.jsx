import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';
import { removeExpandedCourse } from '../actions';

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
    removeExpandedCourseHandler: PropTypes.func.isRequired,
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

	async searchCourse() {
    const { query } = this.state;
    if (!query) return;

    const [result] = await fetchQuery(query, 1);
		const strArr = result.split(' ');
		if (strArr.length < 2) return;

    const subject = strArr[0];
    const catalogNumber = strArr[1];
		this.props.history.push(`/courses/${subject}/${catalogNumber}`);
    this.props.removeExpandedCourseHandler();
	}

  render() {
    return (
      <SearchBar
        hintText="Search for courses"
        dataSource={ this.state.dataSource }
        filter={ (searchValue, key) => searchValue.length }
        onChange={ this.queryForCourse }
        onClick={ this.onClick }
        onRequestSearch={ this.searchCourse }
        onNewRequest={ this.searchCourse }
        style={ this.state.style }
        value={ this.state.query }
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  removeExpandedCourseHandler: () => dispatch(removeExpandedCourse())
});

export default withRouter(connect(null, mapDispatchToProps)(AppSearchBar));
