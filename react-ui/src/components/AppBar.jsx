import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import SearchBar from 'material-ui-search-bar';
import CourseList from '../data/course_list.json';


const styles = {
	backgroundColor: 'rgb(43, 54, 67)',
  textAlign: 'left',
	color: '#E0F7FA',
  position: 'fixed'
}

// Find all courses that match the queried string
const findMatches = (word) => {
  const dataSource = [];
  const regex = new RegExp(word, 'gi');

  for (let i = 0; i < CourseList.length; i++) {
    if (dataSource.length >= 5) break;

    const course = CourseList[i];
    const course_title = course.subject + " " + course.catalog_number;
    const course_title_no_space = course.subject + course.catalog_number;
    const res = course_title.match(regex) || course_title_no_space.match(regex);
    if (dataSource.length < 5 && res) {
      dataSource.push(`${course.subject} ${course.catalog_number}`);
    }
  }

  return { dataSource };
}


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
          onChange={(searchValue) => this.setState(findMatches(searchValue))}
          onRequestSearch={() => this.state.onSearch(this.state.dataSource[0])}
          onNewRequest={() => this.state.onSearch(this.state.dataSource[0])}
          style={{
            marginTop: '5px',
            maxWidth: 800
          }}
        />
      </AppBar>
    );
  }

};
