import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Bar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar';


const styles = {
	container: {
		backgroundColor: 'rgb(43, 54, 67)',
		textAlign: 'left',
		color: '#E0F7FA',
		position: 'fixed',
	},
	logoutButton: {
		marginTop: 11,
		marginLeft: 20
	},
	logoutLabel: {
		color: 'white'
	},
	searchBar: {
		marginTop: '5px',
		width: '30%',
	}
};

class AppBar extends Component {
	static propTypes = {
		toggleSideBar: PropTypes.func.isRequired,
		onLogout: PropTypes.func.isRequired,
		isLoggedIn: PropTypes.bool.isRequired,
	};

	onSearchResult = (subject, catalogNumber) => {
		this.props.history.push(`/courses/${subject}/${catalogNumber}`);
	}

	render() {
		const { toggleSideBar, onLogout, isLoggedIn } = this.props;
		return (
			<Bar
				style={ styles.container }
				onLeftIconButtonClick={ toggleSideBar }
				title="WatsMyMajor"
			>
				<SearchBar onResult={ this.onSearchResult } style={ styles.searchBar } />
				{ isLoggedIn && (
					<FlatButton
						label="Logout"
						onClick={ onLogout }
						labelStyle={ styles.logoutLabel }
						style={ styles.logoutButton }
					/>
				) }
			</Bar>
		);
	}
}

export default withRouter(AppBar);
