import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBar from 'material-ui-search-bar';


export default class AppSearchBar extends Component {

  static propTypes = {
    searchCourseHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
			dataSource: [],
			searchCourseHandler: props.searchCourseHandler
    };
  }

  // Find all courses that match the queried string
	queryForCourse(query) {
		if (!query) return;

		const maxNumberOfResults = 5;

		return fetch(`/courses/query/${query}/${maxNumberOfResults}`)
			.then(response => {
				if (response.status !== 200) {
					console.log('Looks like there was a problem. Status Code: ' +
						response.status);
					this.setState({ dataSource: [] });
					return;
				}

				response.json().then(resultsArr => {
					const dataSource = resultsArr.map(result => {
						const { subject, catalogNumber, title } = result;
						return `${subject} ${catalogNumber} - ${title}`;
					});
					this.setState({ dataSource });
				});
			});
	}

	searchCourseHandler() {
		const strArr = this.state.dataSource[0].split(' ');
		if (!strArr.length) return;
		this.state.searchCourseHandler(strArr[0], strArr[1]);
	}

  render() {
    return (
      <SearchBar
        hintText="Search for courses"
        dataSource={this.state.dataSource}
        filter={(searchValue, key) => searchValue.length}
        onChange={this.queryForCourse.bind(this)}
        onRequestSearch={this.searchCourseHandler.bind(this)}
        onNewRequest={this.searchCourseHandler.bind(this)}
        style={{
          marginTop: '5px',
          maxWidth: 800
        }}
      />
    );
  }

}
