import React from 'react';
import PropTypes from 'prop-types';
import verticalHours from './verticalHours';
import renderDayEvents from './DayEvents';
import DayHeader from './DayHeader';

const height = 2000;

const DayView = ({
	scrollViewer,
	date,
	scrollPosition,
	onScrollChange,
	children,
	isScrollDisable
}) => (
	<div style={{ height: '100%', width: '100%', position: 'relative', overflowY: 'hidden' }}>
		<div
			ref={elem => {
				if(elem != null) {
					this.scrollViewer = elem;
					elem.scrollTop = scrollPosition;
				}
			}}
			onTouchStart={(e) => setTimeout(() => onScrollChange(this.scrollViewer.scrollTop),100)}
			style={{ height: '100%', position: 'relative', overflowY: isScrollDisable ? 'hidden' : 'auto' }}>
			<div style={{ position: 'absolute', height: height + 'px'}}>
				{
					verticalHours()
				}
			</div>
			<div
				key="eventsContainer"
				style={{ height: height + 'px', position: 'absolute', right: '15px', left: '50px' }}>
				{
					renderDayEvents({
						events: children,
						date: date
					})
				}
			</div>
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
			date={date}/>
	</div>
);

DayView.propTypes = {
	date: PropTypes.object.isRequired,
	scrollPosition: PropTypes.number.isRequired,
	onScrollChange: PropTypes.func.isRequired,
	children: PropTypes.array.isRequired,
	isScrollDisable: PropTypes.bool.isRequired,
}

export default DayView;
