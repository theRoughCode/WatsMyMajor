import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Tree from './PrerequisitesTree';
import { hasTakenCourse } from 'utils/courses';
import { objectEquals } from 'utils/arrays';
import 'stylesheets/Tree.css';

// Depth of tree to leave open.
const INITIAL_DEPTH = 2;

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
  backLabel: {
    fontSize: 13,
    fontWeight: 400,
    color: 'white',
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  title: {
    fontSize: 25,
    color: 'white',
    flex: 1,
    marginLeft: 20,
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
  fetch(`/server/tree/${subject}/${catalogNumber}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET
    }
  })
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
    subject: PropTypes.string.isRequired,
    catalogNumber: PropTypes.string.isRequired,
    myCourses: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: null,  // contains data
      tree: null,  // contains current tree view
      canBeSimplified: false,  // true if tree can be simplified
    };

    this.toggleSimplifiedView = this.toggleSimplifiedView.bind(this);
  }

  componentWillMount() {
    const { subject, catalogNumber, myCourses } = this.props;
    getTree(subject, catalogNumber, data => {
      const tree = this.parseNodes(data, myCourses);
      if (tree != null) {
        this.closeAtDepth(tree, INITIAL_DEPTH);
        this.setState({ data, tree });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!objectEquals(nextProps.myCourses, this.props.myCourses)) {
      const tree = this.parseNodes(this.state.data, nextProps.myCourses);
      this.closeAtDepth(tree, INITIAL_DEPTH);
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

  // Parses course node and formats it
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

    // Set canBeSimplified to true if a course has been taken
    if (!this.state.canBeSimplified && courseNode.taken) {
      this.setState({ canBeSimplified: true });
    }

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
    const name = (choose === 0) ? 'Choose all of:' : `Choose ${choose} of:`;
    const chooseNode = {
      name,
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
    let counter = (choose === 0) ? children.length : choose;
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

  // Closes tree from depth n onwards
  closeAtDepth(node, n, currentDepth = 0) {
    if (node.isLeaf || !node.isOpen) return;
    if (node.children == null || node.children.length === 0) return;
    // If we're at the required depth, close the tree
    if (n === currentDepth) {
      this.toggleNode(node);
      return;
    }
    node.children.forEach(child => this.closeAtDepth(child, n, currentDepth + 1));
  }

  // Depth-first traversal to close tree nodes
  closeTree(node) {
    if (node.isLeaf || !node.isOpen) return;
    if (node.children == null || node.children.length === 0) return;
    node.children.forEach(child => this.closeTree(child));
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
    const { tree, canBeSimplified } = this.state;
    const { subject, catalogNumber } = this.props;
    if (tree == null) return null;

    return (
      <div style={ styles.container }>
        <div style={ styles.header }>
          <Link to={ `/courses/${subject}/${catalogNumber}` }>
            <FlatButton
              label={ `Back to ${subject} ${catalogNumber}` }
              labelStyle={ styles.backLabel }
              icon={ <BackIcon style={ styles.backIcon } color="white" /> }
            />
          </Link>
          <span style={ styles.title }>Prerequisites Tree</span>
          {
            canBeSimplified && (
              <Toggle
                label="Simplified View"
                style={ styles.toggle }
                labelStyle={ styles.toggleLabel }
                labelPosition="right"
                onToggle={ this.toggleSimplifiedView }
              />
            )
          }
        </div>
        { tree && (
          <div style={ styles.treeContainer }>
            <Tree data={ tree } />
          </div>
        ) }
      </div>
    );
  }

}

const mapStateToProps = ({ myCourses }) => ({ myCourses });

export default connect(mapStateToProps, null)(PrerequisitesTreeContainer);
