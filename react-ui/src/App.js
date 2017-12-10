import React, { Component } from 'react';
import './stylesheets/App.css';
import AppBar from './components/AppBar';
import SideBar from './components/SideBar';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseView';
import views from './constants/views';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      fetching: true,
			open: true,
			view: views.COURSE_VIEW,
			course: ''
    };

		this.toggleSideBar = this.toggleSideBar.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.getView = this.getView.bind(this);
  }

  componentDidMount() {
    // fetch('/api')
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(`status ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then(json => {
    //     this.setState({
    //       message: json.message,
    //       fetching: false
    //     });
    //   }).catch(e => {
    //     this.setState({
    //       message: `API call failed: ${e}`,
    //       fetching: false
    //     });
    //   })
  }

	toggleSideBar() {
		this.setState({ open: !this.state.open });
	}

	onSearch(course) {
		this.setState({
			view: views.COURSE_VIEW,
			course
		});
	}

	getView() {
		let view = null;

		switch (this.state.view) {
			case views.DASHBOARD_VIEW:
				view = <Dashboard />;
				break;
			case views.COURSE_VIEW:
				view = <CourseView course={this.state.course} />
				break;
			default:
				view = null;
		}

		return view;
	}

  render() {
    return (
      <div className="App">
        <AppBar
					toggleSideBar={this.toggleSideBar}
					onSearch={this.onSearch}
					/>
				<SideBar open={this.state.open} />
				{this.getView()}
      </div>
    );
  }
}

export default App;
