import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';

import DayView from './DayView';
import MultipleDaysView from './MultipleDaysView';
import { addDays } from './dateUtils';

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

function getEventsFromChildren(children) {
	if(children == null) {
		return [];
	} else if (!Array.isArray(children)) {
		return [children];
	} else {
		return children;
	}
}

function getTimeOrDefault(date) {
	return date == null ? 0 : date.getTime();
}

class Calendar extends Component {

	static propTypes = {
		date: PropTypes.instanceOf(Date).isRequired,
		referenceDate: PropTypes.instanceOf(Date).isRequired,
		mode: PropTypes.string.isRequired,
		getIndex: PropTypes.func.isRequired
	}

	constructor(props: Props) {
		super(props);

		this.unControlledDate= new Date();
		this.state = {
			scrollPosition: 630,
			isSwiping: false,
			referenceDate: props.referenceDate,
			getIndex: props.getIndex,
			mode: props.mode
		};
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return getTimeOrDefault(nextProps.date) !== getTimeOrDefault(this.props.date)
			|| nextProps.mode !== this.props.mode
			|| nextState.scrollPosition !== this.state.scrollPosition
			|| nextState.isSwiping !== this.state.isSwipingt;
	}

	componentWillReceiveProps(nextProps) {
	  if (this.state.mode !== nextProps.mode) {
			this.setState({ mode: nextProps.mode });
		}
	}

	onSwitching = (index, mode: 'move' | 'end') => {
		this.setState({
			isSwiping: mode === 'move'
		});
	}

	slideRenderer = (slide) => {
		if(this.state.mode === 'day') {
			return (
				<div key={ slide.key } style={{ position: 'relative', height: '100%', width: '100%' }}>
					<DayView
						onScrollChange={ this.onScrollChange }
						scrollPosition={ this.state.scrollPosition }
						date={ addDays(this.state.referenceDate, slide.index) }
						isScrollDisable={ this.state.isSwiping }
						children={ getEventsFromChildren(this.props.children) }/>
				</div>
			);
		}

		return (
			<div key={ slide.key } style={{ position: 'relative', height: '100%', width: '100%' }}>
				<MultipleDaysView
					onScrollChange={ this.onScrollChange }
					scrollPosition={ this.state.scrollPosition }
					dates={ this.state.mode === 'week' ? this.getWeekDates(slide.index) : this.getThreeDaysDates(slide.index) }
					isScrollDisable={ this.state.isSwiping }
					children={ getEventsFromChildren(this.props.children) }>
				</MultipleDaysView>
			</div>
		);
	}

	getWeekDates = (index) => {
		const currentDay = addDays(this.state.referenceDate, index * 7);
		const dates = [];
    for(var i = 0; i < 7; i++) {
      dates.push(addDays(currentDay, i - currentDay.getDay()));
    }
		return dates;
	}

	getThreeDaysDates = (index) => {
		const currentDay = addDays(this.state.referenceDate, index * 3);
		const dates = [];
    for(var i = 0; i < 3; i++) {
      dates.push(addDays(currentDay, i));
    }
		return dates;
	}

	onScrollChange = (scrollPosition) => {
		this.setState({ scrollPosition: scrollPosition });
	}

	render() {
		return (
			<VirtualizeSwipeableViews
				key={ this.state.mode }
				style={ this.props.style }
				slideStyle={{ height: '100%' }}
				containerStyle={{ height: '100%', willChange: 'transform' }}
				index={ this.state.getIndex() }
				overscanSlideAfter={ 1 }
				overscanSlideBefore={ 1 }
				slideRenderer={ this.slideRenderer }
				onChangeIndex={ this.onChangeIndex }
				onSwitching={ this.onSwitching }/>
		)
	}
}

export default Calendar;
