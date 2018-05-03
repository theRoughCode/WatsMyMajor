// @flow
import type { EventElement } from './types';

import React from 'react';
import verticalHours from './verticalHours';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

const height = 1700;

type Props = {
	date: Date;
	scrollPosition: number;
	onScrollChange: (number) => void;
	children: EventElement[],
	isScrollDisable: boolean,
	onHourDividerClick: (start: Date, end: Date) => void,
	onCreateEvent: () => void,
	newEvent: ?{
		start: Date,
		end: Date
	}
}

class DayView extends React.Component {
	scrollViewer: any;
	props: Props;

	render() {
		return (
			<div style={{ height: '100%', width: '100%', position: 'relative', overflowY: 'hidden' }}>
				<div 
					ref={elem => {
						if(elem != null) {
							this.scrollViewer = elem;
							elem.scrollTop = this.props.scrollPosition;
						}
					}}
					onTouchStart={(e) => setTimeout(() => this.props.onScrollChange(this.scrollViewer.scrollTop),100)}
					style={{ height: '100%', position: 'relative', overflowY: this.props.isScrollDisable ? 'hidden' : 'auto' }}>
					<div style={{ position: 'absolute', height: height + 'px'}}>
						{
							verticalHours()
						}
					</div>
					{
						this.renderEventsContainer(this.props.children, this.props.date)
					}
				</div>
				<DayHeader 
					style={{ 
						position: 'absolute', 
						top: '0px', 
						left: '0px', 
						padding: '10px 0 10px 15px',
						background: 'white',
						boxShadow: '0 14px 28px rgba(255,255,255,0.60), 0 10px 10px rgba(255,255,255,0.80)'
					}}
					date={this.props.date}/>
			</div>
		);
	}

	renderEventsContainer(events: EventElement[], date: Date) {
		return (
			<div 
				key="eventsContainer" 
				style={{ height: height + 'px', position: 'absolute', right: '15px', left: '50px' }}>
				{ 
					renderDayEvents({ 
						events: events, 
						date: date, 
						newEvent: this.props.newEvent, 
						onHourDividerClick: this.props.onHourDividerClick,
						onCreateEvent: this.props.onCreateEvent
					})
				}
			</div>
		);
	}
}

export default DayView;
