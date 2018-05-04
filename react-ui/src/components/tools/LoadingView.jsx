import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';


const styles = {
	margin: 'auto',
	padding: '200px 0'
};

const LoadingView = (props) => (
	<div className="loading course-view">
		<CircularProgress
			size={80}
			thickness={5}
			style={styles}
			/>
	</div>
);

export default LoadingView;
