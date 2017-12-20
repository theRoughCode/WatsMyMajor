import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import SearchBar from 'material-ui-search-bar';


const styles = {
	backgroundColor: 'rgb(43, 54, 67)',
	textAlign: 'left',
	color: '#E0F7FA',
	position: 'fixed'
};


export default class ReactAppBar extends Component {

	static propTypes = {
		toggleSideBar: PropTypes.func.isRequired,
		onSearch: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			dataSource: [],
			toggleSideBar: props.toggleSideBar,
			onSearch: props.onSearch
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

	selectCourseHandler() {
		this.state.onSearch(this.state.dataSource[0]);
	}

	render() {
		return (
			<AppBar
				style={styles}
				onLeftIconButtonClick={this.state.toggleSideBar}
				title="Wat'sMyMajor"
			>
				<SearchBar
					hintText="Search for courses"
					dataSource={this.state.dataSource}
					filter={(searchValue, key) => searchValue.length}
					onChange={this.queryForCourse.bind(this)}
					onRequestSearch={this.selectCourseHandler.bind(this)}
					onNewRequest={this.selectCourseHandler.bind(this)}
					style={{
						marginTop: '5px',
						maxWidth: 800
					}}
				/>
			</AppBar>
		);
	}

};
