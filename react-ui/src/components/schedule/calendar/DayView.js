import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import verticalHours from './verticalHours';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

const height = 2000;
const styles = {
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
    overflowY: 'hidden'
  },
  dayHeader: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: 30,
    padding: '10px 0 10px 15px',
    background: 'white',
    boxShadow: '0 14px 28px rgba(255,255,255,0.60), 0 10px 10px rgba(255,255,255,0.80)'
  },
  bodyContainer: (isScrollDisable) => ({
    height: '100%',
    position: 'relative',
    overflowY: isScrollDisable ? 'hidden' : 'auto'
  }),
  hoursContainer: {
    height,
    position: 'absolute'
  },
  daysContainer: {
    height,
    position: 'absolute',
    right: '15px',
    left: '50px'
  }
}

export default class DayView extends PureComponent {
  static propTypes = {
    date: PropTypes.object.isRequired,
    scrollPosition: PropTypes.number.isRequired,
    onScrollChange: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
    isScrollDisable: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.scrollViewer = React.createRef();
  }

  componentDidMount = () => {
    this.scrollViewer.current.scrollTop = this.props.scrollPosition;
  }

  onScroll = () => {
    const scrollPosition = this.scrollViewer.current.scrollTop;
    this.props.onScrollChange(scrollPosition);
  }

  render() {
    const {
      date,
      children,
      isScrollDisable
    } = this.props;

    return (
      <div style={ styles.container }>
        <div
          ref={ this.scrollViewer }
          onScroll={ this.onScroll }
          style={ styles.bodyContainer(isScrollDisable) }>
          <div style={ styles.hoursContainer }>
            {
              verticalHours()
            }
          </div>
          <div
            key="eventsContainer"
            style={ styles.daysContainer }>
            {
              renderDayEvents({
                events: children,
                date
              })
            }
          </div>
        </div>
        <DayHeader
          style={ styles.dayHeader }
          date={ date }
        />
      </div>
    );
  }
}
