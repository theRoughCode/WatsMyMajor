import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchBar from 'material-ui-search-bar';

class AppSearchBar extends Component {

  static propTypes = {
    style: PropTypes.object
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
      style: props.style
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

	searchCourse() {
		const strArr = this.state.dataSource[0].split(' ');
		if (!strArr.length) return;

    const subject = strArr[0];
    const catalogNumber = strArr[1];
		this.props.history.push(`/courses/${subject}/${catalogNumber}`);
	}

  render() {
    return (
      <SearchBar
        hintText="Search for courses"
        dataSource={ this.state.dataSource }
        filter={ (searchValue, key) => searchValue.length }
        onChange={ this.queryForCourse.bind(this) }
        onRequestSearch={ this.searchCourse.bind(this) }
        onNewRequest={ this.searchCourse.bind(this) }
        style={ this.state.style }
      />
    );
  }
}

export default withRouter(AppSearchBar);
