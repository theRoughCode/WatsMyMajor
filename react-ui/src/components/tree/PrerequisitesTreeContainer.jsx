import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Toggle from 'material-ui/Toggle';
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
  header: {
    margin: 20,
    marginBottom: 0,
    textAlign: 'left',
    display: 'flex',
  },
  title: {
    fontSize: 25,
    color: 'white',
    flex: 1,
  },
  toggle: {
    width: 200,
  },
  toggleLabel: {
    color: 'white'
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

// Returns true if node is a Course node.  False if it is a Choose node.
const isCourseNode = (node) => node.hasOwnProperty('subject');

// Generates random id
const generateRandomId = () => Math.random().toString(36).substr(2, 9);

// Checks if node is taken.  If so, apply taken class name (for styling).
const setTakenClass = (node) => {
  if (!node.taken) return;

  // If there is an existing class name, combine them
  // Assume max of 1 other class name.  If not, need to change this.
  if (node.gProps.className != null) {
    const names = { taken: true };
    names[node.gProps.className] = true;
    node.gProps.className = classNames(names);
  } else {
    node.gProps.className = 'taken';
  }
}

class PrerequisitesTreeContainer extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    myCourses: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: null,
      tree: null,
    };

    this.toggleSimplifiedView = this.toggleSimplifiedView.bind(this);
  }

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

  // Parses data tree and create node tree.
  // *Does not mutate original node.
  parseNodes(node, myCourses) {
    if (node == null) return;
    let treeNode = {};

    if (isCourseNode(node)) {
      treeNode = this.parseCourseNode(node, myCourses);
    } else {
      treeNode = this.parseChooseNode(node, myCourses);
    }

    return treeNode;
  }

  parseCourseNode(node, myCourses) {
    const { subject, catalogNumber, choose, children } = node;
    const id = generateRandomId();
    const courseNode = {
      subject,
      catalogNumber,
      choose,
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

    setTakenClass(courseNode);

    return courseNode;
  }

  parseChooseNode(node, myCourses) {
    const { choose, children } = node;
    const id = generateRandomId();
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
      setTakenClass(chooseNode);
    }

    return chooseNode;
  }

  // Depth-first traversal to simplify tree.
  // Basically, this checks if a parent has a child course that has been taken.
  // If so, we only show that child node.
  // *Does not mutate original node.
  simplifyTree(node) {
    // Create copy
    const simpNode = Object.assign({}, node);

    // If it's a leaf, we can't simplify it
    if (simpNode.isLeaf) return simpNode;

    let { children, _children } = simpNode;
    if (!children) children = [];
    if (!_children) _children = [];

    // If it is a course node or is a choose node that does not have all its
    // prereqs satisfied, we keep all children and recursively simplify tree.
    if (isCourseNode(simpNode) || !simpNode.taken) {
      simpNode.children = children.map(child => this.simplifyTree(child));
      simpNode._children = _children.map(child => this.simplifyTree(child));
    } else {
      // If it is a choose node that has its prereqs fulfilled, we only display
      // the courses that fulfilled it.
      const hiddenChildren = []
      const takenChildren = [];

      const sortChild = (child) => {
        // Simplify child simpNode
        const simpChild = this.simplifyTree(child);
        if (simpChild.taken) takenChildren.push(simpChild);
        else hiddenChildren.push(simpChild);
      };

      // Sort children into appropriate bucket
      children.forEach(sortChild);
      _children.forEach(sortChild);

      if (simpNode.isOpen) {
        simpNode.children = takenChildren;
        simpNode._children = [];
      } else {
        simpNode._children = takenChildren;
        simpNode.children = [];
      }
      simpNode.hidden = hiddenChildren;
    }

    // Re-attach open/close listener
    simpNode.gProps.onClick = this.toggleNode.bind(this, simpNode);

    return simpNode;
  }

  // Returns simplified tree to original
  // *Does not mutate original node.
  unSimplifyTree(node) {
    // Create copy
    const origNode = Object.assign({}, node);

    // If it's a leaf, it wasn't simplified
    if (origNode.isLeaf) return origNode;

    const { children, _children, hidden } = origNode;
    const newChildren =
      (children)
        ? children.map(child => this.unSimplifyTree(child))
        : [];
    const _newChildren =
      (_children)
        ? _children.map(child => this.unSimplifyTree(child))
        : [];

    const sortChild = (child) => {
      const origChild = this.unSimplifyTree(child);
      // Put child in visible children if parent node is open
      if (origNode.isOpen) newChildren.push(origChild);
      else _newChildren.push(origChild);
    }

    // Sort children into appropriate bucket
    if (hidden) hidden.forEach(sortChild);
    delete(origNode.hidden);

    origNode.children = newChildren;
    origNode._children = _newChildren;

    // Re-attach open/close listener
    origNode.gProps.onClick = this.toggleNode.bind(this, origNode);

    return origNode;
  }

  // Depth-first traversal to close tree nodes
  closeTree(node) {
    if (node.isLeaf || !node.isOpen) return;
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

  toggleSimplifiedView(ev, isToggled) {
    let { tree } = this.state;

    if (isToggled) tree = this.simplifyTree(tree); // Want to simplify tree
    else tree = this.unSimplifyTree(tree); // Want to unsimplify tree

    this.setState({ tree });
  }

  render() {
    const { tree } = this.state;
    if (tree == null) return null;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.title}>Prerequisites Tree</span>
          <Toggle
            label="Simplified View"
            style={styles.toggle}
            labelStyle={styles.toggleLabel}
            labelPosition="right"
            onToggle={this.toggleSimplifiedView}
          />
        </div>
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
