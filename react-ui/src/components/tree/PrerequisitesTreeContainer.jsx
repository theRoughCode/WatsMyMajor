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
    data: null,
    tree: null
  };

  componentWillMount() {
    const { subject, catalogNumber } = this.props.match.params;
    getTree(subject, catalogNumber, data => {
      const tree = this.parseNodes(data, this.props.myCourses);
      this.setState({ data, tree });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!objectEquals(nextProps.myCourses, this.props.myCourses)) {
      const tree = this.parseNodes(this.state.data, nextProps.myCourses);
      this.setState({ tree });
    }
  }

  // Returns true if node is a Course node.  False if it is a Choose node.
  isCourseNode(node) {
    return node.hasOwnProperty('subject');
  }

  // Generates random id
  generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
  }

  parseNodes(node, myCourses) {
    if (node == null) return;
    let treeNode = {};

    if (this.isCourseNode(node)) {
      treeNode = this.parseCourseNode(node, myCourses);
    } else {
      treeNode = this.parseChooseNode(node, myCourses);
    }

    // Set taken class name
    if (treeNode.taken) {
      // If there is an existing class name, combine them
      // Assume max of 1 other class name.  If not, need to change this.
      if (treeNode.gProps.className != null) {
        const names = { taken: true };
        names[treeNode.gProps.className] = true;
        treeNode.gProps.className = classNames(names);
      } else {
        treeNode.gProps.className = 'taken';
      }
    }
    return treeNode;
  }

  parseCourseNode(node, myCourses) {
    const { subject, catalogNumber, choose, children } = node;
    const id = this.generateRandomId();
    const courseNode = {
      name: `${subject} ${catalogNumber}`,
      id: `${subject}${catalogNumber}_${id}`,
      taken: hasTakenCourse(subject, catalogNumber, myCourses),
      isOpen: true,
      isLeaf: false,
      gProps: {},
    };

    // Has children
    if (children != null && children.length > 0) {
      // Attach open/close click listener
      courseNode.gProps.onClick = this.toggleNode.bind(this, courseNode);

      // Have to take all prereqs of this course
      if (!choose) {
        courseNode.children = children.map(child => this.parseNodes(child, myCourses));
      } else {
        // i.e. Only need x number of children to fulfill prereqs
        // We need a Choose node in the middle
        const chooseNode = { choose, children };
        const parsedChooseNode = this.parseChooseNode(chooseNode, myCourses);
        courseNode.children = [parsedChooseNode];
      }
    } else {  // Leaf node
      courseNode.isOpen = false;
      courseNode.isLeaf = true;
      courseNode.gProps.className = 'leaf';
    }

    return courseNode;
  }

  parseChooseNode(node, myCourses) {
    const { choose, children } = node;
    const id = this.generateRandomId();
    const chooseNode = {
      name: `Choose ${choose} of:`,
      id,
      taken: false,
      isOpen: true,
      isLeaf: false,
      gProps: {
        className: `choose-${choose}`,
      },
      children: children.map(child => this.parseNodes(child, myCourses)),
    };

    // Attach open/close click listener
    chooseNode.gProps.onClick = this.toggleNode.bind(this, chooseNode);

    // Check children to see if number of taken courses meet requirements
    let counter = choose;
    for (let i = 0; i < chooseNode.children.length; i++) {
      if (counter === 0) break;
      if (chooseNode.children[i].taken) counter--;
    }
    // If 'choose' requirement is met, mark this Choose node as taken.
    if (counter === 0) {
      chooseNode.taken = true;
    }

    return chooseNode;
  }

  // Depth-first traversal to close tree nodes
  closeTree(node) {
    if (node.isLeaf) return;
    if (node.children == null || node.children.length === 0) return;
    for (let i = 0; i < node.children.length; i++) {
      this.closeTree(node.children[i]);
    }
    node._children = node.children;
    node.children = null;
  }

  // Open/close node.
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
    const { tree } = this.state;
    if (tree == null) return null;

    return (
      <div style={styles.container}>
        <span style={styles.title}>Prerequisites Tree</span>
        { tree && (
          <div style={styles.treeContainer}>
            <Tree data={tree} />
          </div>
        ) }
      </div>
    );
  }

}

const mapStateToProps = ({ myCourses }) => ({ myCourses });

export default connect(mapStateToProps, null)(PrerequisitesTreeContainer);
