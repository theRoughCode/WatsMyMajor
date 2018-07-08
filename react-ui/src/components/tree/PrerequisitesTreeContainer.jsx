import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from './PrerequisitesTree';
import '../../stylesheets/Tree.css';


const margin = {
  width: 100,
  height: 25,
};

const styles = {
  container: {
    backgroundColor: '#242424',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 20,
    fontSize: 25,
    color: 'white',
  },
  treeContainer: {
    height: '90%',
    width: '100%',
  }
};

export default class PrerequisitesTreeContainer extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  state = {
    data: null
  };

  componentWillMount() {
    const { subject, catalogNumber } = this.props.match.params;
    fetch(`/tree/${subject}/${catalogNumber}`)
      .then(response => response.json())
      .then(tree => {
        tree = this.bindOnClick(tree);
        this.setState({ data: tree });
      });
  }

  bindOnClick(node) {
    // Create random id
    const id = Math.random().toString(36).substr(2, 9);
    if (node.hasOwnProperty('subject')) {
      node.name = `${node.subject} ${node.catalogNumber}`;
      node.key = node.name + '_' + id;
      if (node.children == null || node.children.length === 0) return node;
      node.gProps = {
        className: 'parent',
        onClick: this.onClick.bind(this, node)
      };
    } else {
      node.name = `Choose ${node.choose} of:`;
      node.key = id;
      node.gProps = {
        className: `choose-${node.choose}`,
        onClick: this.onClick.bind(this, node)
      };
    }
    const children = node.children.map(child => this.bindOnClick(child));
    node.children = children;
    return node;
  }

  onClick(node) {
    const temp = node._children;
    node._children = node.children;
    node.children = temp;
    this.forceUpdate();
  }

  render() {
    const { data } = this.state;
    if (data == null) return null;
    return (
      <div style={styles.container}>
        <span style={styles.title}>Prerequisites Tree</span>
        { data && (
          <div style={styles.treeContainer}>
            <Tree data={data} />
          </div>
        ) }
      </div>
    );
  }

}
