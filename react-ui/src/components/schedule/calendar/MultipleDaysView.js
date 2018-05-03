// @flow
import type { EventElement } from './types';

import React from 'react';
import verticalHours from './verticalHours';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

type Props = {
  dates: Date[],
	scrollPosition: number;
	onScrollChange: (number) => void;
  isScrollDisable: boolean,
	onHourDividerClick: (start: Date, end: Date) => void,
	onCreateEvent: () => void,
	newEvent: ?{
		start: Date,
		end: Date
	},
  children: EventElement[]
}

const firstColumnWidth = '40px';
const headerHeight = '60px';

class MultipleDaysView extends React.Component {
  scrollViewer: any;
  props: Props;

  render() {
    return (
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
            this.renderDaysHeader(this.props.dates)
          }
        </div>
        <div 
					ref={elem => {
						if(elem != null) {
							this.scrollViewer = elem;
							elem.scrollTop = this.props.scrollPosition;
						}
					}}
					onTouchStart={(e) => setTimeout(() => this.props.onScrollChange(this.scrollViewer.scrollTop),100)}
          style={{ 
            height: `calc(100% - ${headerHeight})`,
            position: 'absolute', 
            left: '0', 
            right: '0', 
            top: headerHeight, 
            bottom: '0',
            overflowY: this.props.isScrollDisable ? 'hidden' : 'auto',
            overflowX: 'hidden'
          }}>
          <div style={{ height: '1700px', position: 'absolute', left: '0', top: '0', borderTop: '1px solid #F3F3F3' }}>
            {
              verticalHours()
            }
          </div>
          <div style={{ height: '1700px', position: 'absolute', right: '0', left: firstColumnWidth, top: '0' }}>
            {
              this.renderDays(this.props.dates)
            }
          </div>
        </div>
      </div>
    )
  }

  renderDaysHeader(dates: Date[]) {
    return dates.map((date,i) => (
      <DayHeader 
        key={i}
        style={{ 
          position: 'absolute',
          left: `${(100 / this.props.dates.length) * i}%`,
          width: `${100 / this.props.dates.length}%`,
          height: headerHeight,
          borderLeft: 'solid 1px #F3F3F3',
          borderBottom: 'solid 1px #F3F3F3',
          padding: '5px',
          boxSizing: 'border-box'
        }} 
        date={date}/>
    ));
  }

  renderDays(dates: Date[]) {
    return dates.map((date,i) => (
      <div 
        key={i}
        style={{ 
          position: 'absolute',
          height: '100%', 
          left: `${(100 / this.props.dates.length) * i}%`,
          width: `${100 / this.props.dates.length}%`,
          borderLeft: 'solid 1px #F3F3F3'
        }}>
        {
					renderDayEvents({ 
						events: this.props.children, 
						date: date, 
						newEvent: this.props.newEvent, 
						onHourDividerClick: this.props.onHourDividerClick,
						onCreateEvent: this.props.onCreateEvent
					})
        }
      </div>
    ));
  }
}

export default MultipleDaysView;