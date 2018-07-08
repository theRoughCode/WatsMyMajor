import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Tree from './PrerequisitesTree';
import { hasTakenCourse } from '../../utils/courses';
import { objectEquals } from '../../utils/arrays';
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

const getTree = (subject, catalogNumber, callback) => {
  fetch(`/tree/${subject}/${catalogNumber}`)
    .then(response => response.json())
    .then(callback);
};

class PrerequisitesTreeContainer extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    myCourses: PropTypes.object.isRequired,
  };

  state = {
    data: null
  };

  componentWillMount() {
    const { subject, catalogNumber } = this.props.match.params;
    getTree(subject, catalogNumber, tree => {
      tree = this.parseNodes(tree, this.props.myCourses);
      this.setState({ data: tree });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!objectEquals(nextProps.myCourses, this.props.myCourses)) {
      const tree = this.parseNodes(this.state.data, nextProps.myCourses);
      this.setState({ data: tree });
    }
  }

  parseNodes(node, myCourses) {
    // Create random id
    const id = Math.random().toString(36).substr(2, 9);
    if (node.hasOwnProperty('subject')) {
      node.name = `${node.subject} ${node.catalogNumber}`;
      node.id = node.name + '_' + id;
      node.taken = hasTakenCourse(node.subject, node.catalogNumber, myCourses);

      let children = node.children || node._children;
      // Has children
      if (children != null && children.length > 0) {
        node.gProps = {
          onClick: this.toggleNode.bind(this, node)
        };
        children = children.map(child => this.parseNodes(child, myCourses));
        node.children = children;
        node.isOpen = true;
      } else {
        node.isLeaf = true;
        node.gProps = {
          className: 'leaf'
        };
      }
    } else {
      node.name = `Choose ${node.choose} of:`;
      node.id = id;
      node.isOpen = true;
      node.gProps = {
        className: `choose-${node.choose}`,
        onClick: this.toggleNode.bind(this, node)
      };
      let children = node.children || node._children;
      children = children.map(child => this.parseNodes(child, myCourses));
      node.children = children;

      // Check children to see if number of taken courses meet requirements
      let counter = node.choose;
      for (let i = 0; i < children.length; i++) {
        if (counter === 0) break;
        if (children[i].taken) counter--;
      }
      if (counter === 0) {
        node.taken = true;
      }
    }

    // Set taken class name
    if (node.taken) {
      if (node.gProps.className != null) {
        const names = { taken: true };
        names[node.gProps.className] = true;
        node.gProps.className = classNames(names);
      } else {
        node.gProps.className = 'taken';
      }
    }
    return node;
  }

  // Depth-first traversal to close tree
  closeTree(node) {
    if (node.isLeaf) return;
    if (node.children == null || node.children.length === 0) return;
    for (let i = 0; i < node.children.length; i++) {
      this.closeTree(node.children[i]);
    }
    node._children = node.children;
    node.children = null;
  }

  toggleNode(node) {
    if (node.isLeaf) return;
    if (node.isOpen) {
      this.closeTree(node);
      node.isOpen = false;
    } else {
      node.children = node._children;
      node._children = null;
      node.isOpen = true;
    }
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

const mapStateToProps = ({ myCourses }) => ({ myCourses });

export default connect(mapStateToProps, null)(PrerequisitesTreeContainer);
