import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import MyCourseSideBar from './MyCourseSideBar';
import MyCourseAppBar from './MyCourseAppBar';
import TermRow from './TermRow';
import { DragTypes } from '../../constants/DragTypes';
import { arrayOfObjectEquals } from '../../utils/arrays';
import { hasTakenCourse, isInCart } from '../../utils/courses';
import emptyBoardImage from '../../images/empty_board.png';
import {
  reorderUserCourses,
  updateUserCourses,
  reorderCart,
  unhighlightPrereqs,
  highlightPrereqs,
  createSnack
} from '../../actions';

const NUM_PER_ROW = 3;
const styles = {
  viewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowX: 'hidden',
  },
  boardContainer: {
    width: '70%',
    height: 'fit-content',
    padding: '30px 60px',
    display: 'flex',
  },
  termRowContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  emptyContainer: {
    width: '90%',
    height: '90%',
    margin: 'auto',
    padding: '70px 0px',
    border: '2px dashed #888e99',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  emptyInnerDiv: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  emptyImage: {
    margin: 'auto',
  },
  emptyTextDiv: {
    margin: 'auto',
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
  },
  emptyTextTitle: {
    fontSize: 25,
  },
  emptyTextSubtitle: {
    fontSize: 22,
    color: '#888e99',
  }
}

class CourseBoardContainer extends Component {

  static propTypes = {
    courseList: PropTypes.array.isRequired,
    myCourses: PropTypes.object.isRequired,
    cart: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    updateCourseHandler: PropTypes.func.isRequired,
    reorderCourseHandler: PropTypes.func.isRequired,
    reorderCartHandler: PropTypes.func.isRequired,
    deselectCourseHandler: PropTypes.func.isRequired,
    highlightPrereqsHandler: PropTypes.func.isRequired,
    sendDuplicateCourseSnack: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      courseList,
      cart,
      username,
      updateCourseHandler,
      reorderCourseHandler,
      reorderCartHandler,
      deselectCourseHandler,
    } = props;

    this.state = {
      courseList,
      cart,
      username,
    };

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragTerm = this.onDragTerm.bind(this);
    this.onDragCourse = this.onDragCourse.bind(this);
    this.move = this.move.bind(this);
    this.loadCourses = this.loadCourses.bind(this);
    this.clearCourses = this.clearCourses.bind(this);
    this.importTerms = this.importTerms.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.reorderTerm = this.reorderTerm.bind(this);
    this.getBoard = this.getBoard.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.renameBoard = this.renameBoard.bind(this);
    this.addBoard = this.addBoard.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.deleteBoard = this.deleteBoard.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.updateCourseHandler = updateCourseHandler;
    this.reorderCourseHandler = reorderCourseHandler;
    this.reorderCartHandler = reorderCartHandler;
    this.deselectCourseHandler = deselectCourseHandler;
  }

  componentWillReceiveProps(nextProps) {
    if (!arrayOfObjectEquals(nextProps.courseList, this.state.courseList)) {
      this.setState({ courseList: nextProps.courseList });
    }
    if (!arrayOfObjectEquals(nextProps.cart, this.state.cart)) {
      this.setState({ cart: nextProps.cart });
    }
    if (nextProps.username !== this.state.username) {
      this.setState({ username: nextProps.username });
    }
  }

  getTermList(id) {
    return this.state.courseList[id].courses;
  }

  // Highlight prereqs when dragging a course card
  onDragStart(start) {
    if (start.type !== DragTypes.COURSE) return;
    const splitId = start.draggableId.split("/");
    if (splitId.length < 3) return;
    const [ subject, catalogNumber ] = splitId;
    let prereqs = [];
    switch (start.source.droppableId) {
    case "Cart":
      prereqs = this.state.cart[start.source.index].prereqs || [];
      break;
    default:
      if (this.props.myCourses.hasOwnProperty(subject)
          && this.props.myCourses[subject].hasOwnProperty(catalogNumber)) {
        prereqs = this.props.myCourses[subject][catalogNumber];
      }
    }
    if (prereqs.length === 0) return;
    this.props.highlightPrereqsHandler(prereqs);
  }

  onDragEnd(result) {
    const { source, destination } = result;
    this.deselectCourseHandler();

    // dropped outside the list
    if (!destination) return;

    switch (result.type) {
    case DragTypes.COLUMN:
      this.onDragTerm(source, destination);
      break;
    case DragTypes.COURSE:
      this.onDragCourse(source, destination);
      break;
    default:
    }
  }

  // Called when a term is being dragged
  onDragTerm(source, destination) {
    const fromRowNum = Number(source.droppableId.split('/')[1]);
    const toRowNum = Number(destination.droppableId.split('/')[1]);
    const fromIndex = source.index + fromRowNum * NUM_PER_ROW;
    // Offset by 1 when moving from a lower number to higher because the indices
    // have not been reshuffled yet to account for the blank space in the lower row.
    const offsetNum = (fromRowNum < toRowNum) ? 1 : 0;
    const toIndex = destination.index + toRowNum * NUM_PER_ROW - offsetNum;

    if (fromIndex === toIndex) return;
    const { username, courseList } = this.state;
    const [removed] = courseList.splice(fromIndex, 1);
    courseList.splice(toIndex, 0, removed);
    this.setState({ courseList });
    this.reorderCourseHandler(username, courseList);
  }

  // Called when a course is being dragged
  onDragCourse(source, destination) {
    if (source.droppableId === destination.droppableId) {
      this.reorderTerm(source.droppableId, source.index, destination.index);
    } else {
      this.move(source, destination);
    }
  }

  // Retrieves board
  getBoard(id) {
    switch (id) {
    case 'Cart':
      return this.state.cart;
    case 'Trash':
      return null;
    default:
      return this.state.courseList[id].courses || [];
    }
  }

  // Updates the board
  updateBoard(id, board) {
    switch (id) {
    case 'Cart':
      this.setState({ cart: board });
      this.reorderCartHandler(this.state.username, board);
      break;
    case 'Trash': break;
    default: {
      const { username, courseList } = this.state;
      courseList[id].courses = board;
      this.setState({ courseList });
      this.reorderCourseHandler(username, courseList);
    }
    }
  }

  // Reorder term board
  reorderTerm(id, fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    const board = this.getBoard(id);
    const [removed] = board.splice(fromIndex, 1);
    board.splice(toIndex, 0, removed);
    this.updateBoard(id, board);
  }

  // Move an item between terms
  move(source, dest) {
    const sourceBoard = this.getBoard(source.droppableId);
    const destBoard = this.getBoard(dest.droppableId);
    const [removed] = sourceBoard.splice(source.index, 1);
    if (destBoard) destBoard.splice(dest.index, 0, removed);
    this.updateBoard(source.droppableId, sourceBoard);
    this.updateBoard(dest.droppableId, destBoard);
  }

  renameBoard(id, name, level) {
    const { username, courseList } = this.state;
    courseList[id].term = name;
    courseList[id].level = level;
    this.setState({ courseList });
    this.reorderCourseHandler(username, courseList);
  }

  clearBoard(id) {
    const { username, courseList } = this.state;
    courseList[id].courses = [];
    this.setState({ courseList });
    this.reorderCourseHandler(username, courseList);
  }

  clearCart() {
    this.setState({ cart: [] });
    this.reorderCartHandler(this.state.username, []);
  }

  addBoard(term, level) {
    const { username, courseList } = this.state;
    courseList.push({ term, level, courses: [] });
    this.setState({ courseList });
    this.reorderCourseHandler(username, courseList);
  }

  loadCourses(id, newCourses) {
    const { username, courseList } = this.state;
    let courses = courseList[id].courses || [];

    // Dedup courses: remove courses that are duplicates from new courses
    let hasDuplicate = false;
    newCourses = newCourses.filter(({ subject, catalogNumber }) => {
      const isDuplicate =
        hasTakenCourse(subject, catalogNumber, this.props.myCourses) ||
        isInCart(subject, catalogNumber, this.state.cart);
      if (isDuplicate) hasDuplicate = true;
      return !isDuplicate;
    });
    if (hasDuplicate) this.props.sendDuplicateCourseSnack();
    if (newCourses.length === 0) return;

    courses = courses.concat(newCourses);
    courseList[id].courses = courses;

    this.setState({ courseList });
    this.updateCourseHandler(username, courseList);
  }

  clearCourses() {
    this.setState({ courseList: [] });
    this.updateCourseHandler(this.state.username, []);
  }

  importTerms(terms) {
    const { username, courseList } = this.state;

    // Dedup courses: remove courses that are duplicates in imported terms
    let duplicateCourse = false;
    terms = terms.map(term => {
      term.courses = term.courses.filter(({ subject, catalogNumber }) => {
        const isDuplicate =
          hasTakenCourse(subject, catalogNumber, this.props.myCourses) ||
          isInCart(subject, catalogNumber, this.state.cart);
        if (isDuplicate) duplicateCourse = true;
        return !isDuplicate;
      });
      return term;
    });
    if (duplicateCourse) this.props.sendDuplicateCourseSnack();

    if (courseList.length > 0) {
      // Merge courses in same term
      courseList.forEach((termItem) => {
        const { term, courses } = termItem;
        let isDuplicate = false;
        for (let i = 0; i < terms.length; i++) {
          if (term === terms[i].term) {
            if (courses != null) terms[i].courses.push(...courses);
            isDuplicate = true;
            break;
          }
        }
        // Add course if is not in imported terms
        if (!isDuplicate) terms.push(termItem);
      });
    }

    this.setState({ courseList: terms });
    this.updateCourseHandler(username, terms);
  }

  deleteBoard(id) {
    const { username, courseList } = this.state;
    courseList.splice(id, 1);
    this.setState({ courseList });
    this.reorderCourseHandler(username, courseList);
  }

  renderBoard() {
    const { courseList } = this.state;
    const numTerms = courseList.length;

    // Empty board
    if (numTerms === 0) {
      return (
        <div style={ styles.emptyContainer }>
          <div style={ styles.emptyInnerDiv }>
            <img src={ emptyBoardImage } alt="Empty Board" style={ styles.emptyImage } />
            <div style={ styles.emptyTextDiv }>
              <span style={ styles.emptyTextTitle }>
                Oops, looks like there's nothing here yet.
              </span><br />
              <span style={ styles.emptyTextSubtitle }>
                Add a term or add courses to your cart!
              </span>
            </div>
          </div>
        </div>
      );
    }

    const numRows = Math.ceil(numTerms / 3);
    return (
      <div style={ styles.termRowContainer }>
        {
          Array(numRows).fill().map((_, i) => {
            const courses = courseList.slice(i * NUM_PER_ROW, (i + 1) * NUM_PER_ROW);
            return (
              <TermRow
                key={ i }
                rowNumber={ i }
                courseList={ courses }
                onClearBoard={ this.clearBoard }
                onRenameBoard={ this.renameBoard }
                onDeleteBoard={ this.deleteBoard }
                onUpdateCourses={ this.loadCourses }
              />
            )
          })
        }
      </div>
    );
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MyCourseAppBar
          onAddBoard={ this.addBoard }
          onImport={ this.importTerms }
          onClear={ this.clearCourses }
          showClearButton={ this.state.courseList.length > 0 }
        />
        <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd }>
          <div style={ styles.viewContainer }>
            <div style={ styles.boardContainer }>
              { this.renderBoard() }
            </div>
            <MyCourseSideBar
              cartCourses={ this.state.cart }
              onClearCart={ this.clearCart }
            />
          </div>
        </DragDropContext>
      </div>
    );
  }
}

const mapStateToProps = ({ courseList, cart, user, myCourses }) => {
  const { username } = user;
  return { courseList, cart, username, myCourses };
};

const mapDispatchToProps = dispatch => {
  return {
    updateCourseHandler: (username, courseList) => {
      dispatch(updateUserCourses(username, courseList));
    },
    reorderCourseHandler: (username, courseList) => {
      dispatch(reorderUserCourses(username, courseList));
    },
    reorderCartHandler: (username, cart) => {
      dispatch(reorderCart(username, cart));
    },
    deselectCourseHandler: () => {
      dispatch(unhighlightPrereqs());
    },
    highlightPrereqsHandler: (prereqs) => {
      if (prereqs == null || prereqs.length === 0) return;
      dispatch(highlightPrereqs(prereqs));
    },
    sendDuplicateCourseSnack: () => {
      dispatch(createSnack('Duplicate courses were removed.'))
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseBoardContainer));
