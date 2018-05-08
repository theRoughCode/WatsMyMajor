import React from 'react';
import PropTypes from 'prop-types';
import verticalHours from './verticalHours';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

const height = 2500;
const firstColumnWidth = '40px';
const headerHeight = '60px';

const renderDaysHeader = (dates) => {
  return dates.map((date,i) => (
    <DayHeader
      key={i}
      style={{
        position: 'absolute',
        left: `${(100 / dates.length) * i}%`,
        width: `${100 / dates.length}%`,
        height: headerHeight,
        borderLeft: 'solid 1px #F3F3F3',
        borderBottom: 'solid 1px #F3F3F3',
        padding: '5px',
        boxSizing: 'border-box'
      }}
      date={date}/>
  ));
}

const renderDays = (dates, children) => {
  return dates.map((date,i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        height: '100%',
        left: `${(100 / dates.length) * i}%`,
        width: `${100 / dates.length}%`,
        borderLeft: 'solid 1px #F3F3F3'
      }}>
      {
        renderDayEvents({
          events: children,
          date: date,
        })
      }
    </div>
  ));
}

const MultipleDaysView = ({
  dates,
  scrollPosition,
  onScrollChange,
  isScrollDisable,
  children
}) => (
  <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      height: headerHeight,
      position: 'absolute',
      left: '0',
      top: '0',
      width: firstColumnWidth,
      borderBottom: 'solid 1px #F3F3F3',
      boxSizing: 'border-box'
    }}>
    </div>
    <div style={{ height: headerHeight, position: 'absolute', right: '0', left: firstColumnWidth, top: '0' }}>
      {
        renderDaysHeader(dates)
      }
    </div>
    <div
      ref={elem => {
        if(elem != null) {
          this.scrollViewer = elem;
          elem.scrollTop = scrollPosition;
        }
      }}
      onTouchStart={(e) => setTimeout(() => onScrollChange(this.scrollViewer.scrollTop),100)}
      style={{
        height: `calc(100% - ${headerHeight})`,
        position: 'absolute',
        left: '0',
        right: '0',
        top: headerHeight,
        bottom: '0',
        overflowY: isScrollDisable ? 'hidden' : 'auto',
        overflowX: 'hidden'
      }}>
      <div style={{ height: height + 'px', position: 'absolute', left: '0', top: '0', borderTop: '1px solid #F3F3F3' }}>
        {
          verticalHours()
        }
      </div>
      <div style={{ height: height + 'px', position: 'absolute', right: '0', left: firstColumnWidth, top: '0' }}>
        {
          renderDays(dates, children)
        }
      </div>
    </div>
  </div>
);

MultipleDaysView.propTypes = {
  dates: PropTypes.array.isRequired,
	scrollPosition: PropTypes.number.isRequired,
	onScrollChange: PropTypes.func.isRequired,
  isScrollDisable: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default MultipleDaysView;
