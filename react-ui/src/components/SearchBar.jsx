import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchBar from 'material-ui-search-bar';
import { setCourse } from '../actions/index';


const style = {
  maxWidth: 800
};

class AppSearchBar extends Component {

  static propTypes = {
    selectCourseHandler: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
			dataSource: [],
			selectCourseHandler: props.selectCourseHandler
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
		this.state.selectCourseHandler(subject, catalogNumber);
	}


// TODO: Reimplement this when material-ui-search-bar code is updated
    // hintText="Search for courses"
    // dataSource={ this.state.dataSource }
    // onNewRequest={ this.searchCourse.bind(this) }
    // filter={ (searchValue, key) => searchValue.length }

  render() {
    return (
      <SearchBar
        onChange={ this.queryForCourse.bind(this) }
        onRequestSearch={ this.searchCourse.bind(this) }
        style={ style }
      />
    );
  }

}

const mapDispatchToProps = dispatch => {
  return {
		selectCourseHandler: (subject, catalogNumber) => {
			dispatch(setCourse(subject, catalogNumber));
		}
  }
};

export default withRouter(connect(null, mapDispatchToProps)(AppSearchBar));
