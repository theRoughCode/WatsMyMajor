//@flow

import React from 'react';

type Props = {
  start: Date,
  end: Date,
  style?: any,
  onClick? : () => void,
  title?: string
}

class Event extends React.Component {
  props: Props;

  render() {
    return (
      <div 
        onClick={this.props.onClick}
        style={this.props.style}>
        {
          this.props.title
        }
      </div>
    )
  }  
}

export default Event;