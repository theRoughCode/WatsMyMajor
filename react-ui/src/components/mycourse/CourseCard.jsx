import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';


export default class CoursePaper extends Component {

	static propTypes = {
		subject: PropTypes.string.isRequired,
		catalogNumber: PropTypes.string.isRequired,

		// DnD
		provided: PropTypes.object.isRequired,
		snapshot: PropTypes.object.isRequired,

		getItemStyle: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		const {
			subject,
			catalogNumber,
			provided,
			snapshot,
			getItemStyle
		} = props;

		this.state = {
			subject,
			catalogNumber,
			provided,
			snapshot,
			getItemStyle
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.state) {
			const {
				subject,
				catalogNumber,
				provided,
				snapshot
			} = nextProps;

			this.setState({
				subject,
				catalogNumber,
				provided,
				snapshot
			});
		}
	}

	render() {
		const {
			subject,
			catalogNumber,
			provided,
			snapshot,
			getItemStyle
		} = this.state;

		return (
			<Paper zDepth={1}>
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={getItemStyle(
						snapshot.isDragging,
						provided.draggableProps.style,
					)}
				>
					{`${subject} ${catalogNumber}`}
				</div>
				{provided.placeholder}
			</Paper>
		);
	}

}
