import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from 'react-tree-graph';
import Dimensions from 'react-dimensions';

const MAX_WIDTH = 1480;

// We need a component because react-dimensions will complain if we use a
// stateless presentational component.
class PrerequisitesTree extends Component {
  static propTypes = {
    data: PropTypes.object,
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
  };

  render() {
    let { data, containerWidth, containerHeight } = this.props;
    if (containerWidth > MAX_WIDTH) containerWidth = MAX_WIDTH;
    return (
      <Tree
        data={ data }
        height={ containerHeight }
        width={ containerWidth }
        nodeOffset={ 5 }
        nodeRadius={ 10 }
        margins={{
          bottom: 50,
          left: 50,
          right: 130,
          top: 50
        }}
        svgProps={{ className: 'tree' }}
        keyProp="id"
        animated
      />
    );
  }
}

export default Dimensions()(PrerequisitesTree);
