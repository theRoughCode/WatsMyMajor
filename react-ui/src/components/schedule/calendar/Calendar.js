import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';

import DayView from './DayView';
import MultipleDaysView from './MultipleDaysView';
import { addDays } from './dateUtils';
import { arrayEquals } from 'utils/arrays';

const MODE_DAY = 'day';
const MODE_WEEK = 'week';
const MODE_MOVE = 'move';
const DAYS_IN_WEEK = 7;
const DAYS_IN_THREE_DAYS = 3;

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const styles = {
  container: {
    height: '100%',
    willChange: 'transform',
  },
  slide: {
    height: '100%',
  },
  slideContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
};

function getEventsFromChildren(children) {
  if (children == null) {
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
    getIndex: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.unControlledDate = new Date();
    this.state = {
      scrollPosition: 630,
      isSwiping: false,
      referenceDate: props.referenceDate,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      getTimeOrDefault(nextProps.date) !== getTimeOrDefault(this.props.date) ||
      nextProps.mode !== this.props.mode ||
      nextState.scrollPosition !== this.state.scrollPosition ||
      nextState.isSwiping !== this.state.isSwiping ||
      !arrayEquals(nextProps.children, this.props.children)
    );
  }

  onSwitching = (_, mode) => {
    this.setState({
      isSwiping: mode === MODE_MOVE,
    });
  };

  slideRenderer = (slide) => {
    const { scrollPosition, referenceDate, isSwiping } = this.state;
    const { mode, children } = this.props;

    return (
      <div key={slide.key} style={styles.slideContainer}>
        {mode === MODE_DAY ? (
          <DayView
            onScrollChange={this.onScrollChange}
            scrollPosition={scrollPosition}
            date={addDays(referenceDate, slide.index)}
            isScrollDisable={isSwiping}
            children={getEventsFromChildren(children)}
          />
        ) : (
          <MultipleDaysView
            onScrollChange={this.onScrollChange}
            scrollPosition={scrollPosition}
            dates={
              mode === MODE_WEEK
                ? this.getWeekDates(slide.index)
                : this.getThreeDaysDates(slide.index)
            }
            isScrollDisable={isSwiping}
            children={getEventsFromChildren(children)}
          />
        )}
      </div>
    );
  };

  getWeekDates = (index) => {
    const currentDay = addDays(this.state.referenceDate, index * DAYS_IN_WEEK);
    return [...Array(DAYS_IN_WEEK)].map((_, i) => addDays(currentDay, i - currentDay.getDay()));
  };

  getThreeDaysDates = (index) => {
    const currentDay = addDays(this.state.referenceDate, index * DAYS_IN_THREE_DAYS);
    return [...Array(DAYS_IN_THREE_DAYS)].map((_, i) => addDays(currentDay, i));
  };

  onScrollChange = (scrollPosition) => {
    this.setState({ scrollPosition });
  };

  render() {
    const index = this.props.getIndex();

    return (
      <VirtualizeSwipeableViews
        key={this.props.mode}
        style={this.props.style}
        slideStyle={styles.slide}
        containerStyle={styles.container}
        index={index}
        overscanSlideAfter={1}
        overscanSlideBefore={1}
        slideRenderer={this.slideRenderer}
        onSwitching={this.onSwitching}
      />
    );
  }
}

export default Calendar;
