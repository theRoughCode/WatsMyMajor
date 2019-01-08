import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { DragDropContext } from 'react-beautiful-dnd';
import ReactTooltip from 'react-tooltip';
import MyCourseSideBar from './MyCourseSideBar';
import MyCourseAppBar from './MyCourseAppBar';
import TermRow from './TermRow';
import LoadingView from '../tools/LoadingView';
import { DragTypes } from 'constants/DragTypes';
import { arrayOfObjectEquals } from 'utils/arrays';
import { hasTakenCourse, isInCart } from 'utils/courses';
import emptyBoardImage from 'images/empty_board.png';
import {
  updateUserCourses,
  setCart,
  unhighlightPrereqs,
  highlightPrereqs,
  createSnack
} from 'actions';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  viewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowX: 'hidden',
  },
  boardContainer: {
    width: 'calc(100% - 250px)',
    height: 'fit-content',
    marginRight: 250,
    padding: '30px 0',
    display: 'flex',
  },
  termRowContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: 'auto',
    overflowX: 'auto',
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
  },
}

const mobileStyles = {
  viewContainer: {
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: 10,
  },
  boardContainer: {
    width: '100%',
    height: '100%',
    margin: 'auto',
    display: 'flex',
  },
  termRowContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    margin: 'auto',
    overflow: 'none',
  },
};

// Make call asynchronously (kinda hacky)
const doAsync = func => setTimeout(func, 1);

class CourseBoardContainer extends Component {

  static propTypes = {
    courseList: PropTypes.array.isRequired,
    myCourses: PropTypes.object.isRequired,
    cart: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    updateCourseHandler: PropTypes.func.isRequired,
    setCartHandler: PropTypes.func.isRequired,
    deselectCourseHandler: PropTypes.func.isRequired,
    highlightPrereqsHandler: PropTypes.func.isRequired,
    sendDuplicateCourseSnack: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { username } = props;

    this.state = {
      courseList: [],
      cart: [],
      loading: true,
      username,
      isDraggingCourse: false,
    };
  }

  async componentDidMount() {
    this.setState({
      courseList: this.props.courseList,
      cart: this.props.cart,
      loading: false,
    });
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  async componentWillReceiveProps(nextProps) {
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

  getTermList = (id) =>  this.state.courseList[id].courses;

  // Highlight prereqs when dragging a course card
  onDragStart = (start) => {
    if (start.type !== DragTypes.COURSE) return;
    this.setState({ isDraggingCourse: true });

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

  onDragEnd = (numPerRow) => (result) => {
    const { source, destination } = result;
    this.props.deselectCourseHandler();

    // dropped outside the list
    if (!destination) return;

    switch (result.type) {
    case DragTypes.COLUMN:
      this.onDragTerm(source, destination, numPerRow);
      break;
    case DragTypes.COURSE:
      this.setState({ isDraggingCourse: false });
      this.onDragCourse(source, destination, numPerRow);
      break;
    default:
    }
  }

  // Called when a term is being dragged
  onDragTerm = (source, destination, numPerRow) => {
    const fromRowNum = Number(source.droppableId.split('/')[1]);
    const toRowNum = Number(destination.droppableId.split('/')[1]);
    const fromIndex = source.index + fromRowNum * numPerRow;
    // Offset by 1 when moving from a lower number to higher because the indices
    // have not been reshuffled yet to account for the blank space in the lower row.
    const offsetNum = (fromRowNum < toRowNum) ? 1 : 0;
    const toIndex = destination.index + toRowNum * numPerRow - offsetNum;

    if (fromIndex === toIndex) return;
    const { username, courseList } = this.state;
    const [removed] = courseList.splice(fromIndex, 1);
    courseList.splice(toIndex, 0, removed);
    this.setState({ courseList });
    this.props.updateCourseHandler(username, courseList);
  }

  // Called when a course is being dragged
  onDragCourse = (source, destination) => {
    if (source.droppableId === destination.droppableId) {
      this.reorderTerm(source.droppableId, source.index, destination.index);
    } else {
      this.move(source, destination);
    }
  }

  // Retrieves board
  getBoard = (id) => {
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
  updateBoard = (id, board) => {
    switch (id) {
    case 'Cart':
      this.setState({ cart: board });
      doAsync(() => this.props.setCartHandler(this.state.username, board));
      break;
    case 'Trash': break;
    default: {
      const { username, courseList } = this.state;
      courseList[id].courses = board;
      this.setState({ courseList });
      doAsync(() => this.props.updateCourseHandler(username, courseList));
    }
    }
  }

  // Reorder term board
  reorderTerm = (id, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const board = this.getBoard(id);
    const [removed] = board.splice(fromIndex, 1);
    board.splice(toIndex, 0, removed);
    this.updateBoard(id, board);
  }

  // Move an item between terms
  move = (source, dest) => {
    const sourceBoard = this.getBoard(source.droppableId);
    const destBoard = this.getBoard(dest.droppableId);
    const [removed] = sourceBoard.splice(source.index, 1);
    if (destBoard) destBoard.splice(dest.index, 0, removed);
    // TODO: Think about not updating twice (2 network requests)
    this.updateBoard(source.droppableId, sourceBoard);
    this.updateBoard(dest.droppableId, destBoard);
  }

  renameBoard = (id, name, level) => {
    const { username, courseList } = this.state;
    courseList[id].term = name;
    courseList[id].level = level;
    this.setState({ courseList });
    this.props.updateCourseHandler(username, courseList);
  }

  clearBoard = (id) => {
    const { username, courseList } = this.state;
    courseList[id].courses = [];
    this.setState({ courseList });
    this.props.updateCourseHandler(username, courseList);
  }

  clearCart = () => {
    this.setState({ cart: [] });
    this.props.setCartHandler(this.state.username, []);
  }

  addBoard = (term, level) => {
    const { username, courseList } = this.state;
    courseList.push({ term, level, courses: [] });
    this.setState({ courseList });
    this.props.updateCourseHandler(username, courseList);
  }

  loadCourses = async (id, newCourses) => {
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

    courseList[id].courses = courses.concat(newCourses);

    this.setState({ courseList });
    this.props.updateCourseHandler(username, courseList);
  }

  clearCourses = () => {
    this.setState({ courseList: [] });
    this.props.updateCourseHandler(this.state.username, []);
  }

  importTerms = (terms) => {
    const { username, courseList } = this.state;

    // Dedup courses: remove courses that are duplicates in imported terms
    // Duplicated course before import takes precedence
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

    // Alert user that a duplicate course was found and we're removing it
    if (duplicateCourse) this.props.sendDuplicateCourseSnack();

    if (courseList.length > 0) {
      // Merge courses in current course list into new terms (based on same term)
      courseList.forEach((termItem) => {
        const { term, courses, level } = termItem;
        let isDuplicate = false;
        for (let i = 0; i < terms.length; i++) {
          if (term === terms[i].term && level === terms[i].level) {
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
    this.props.updateCourseHandler(username, terms);
  }

  deleteBoard = (id) => {
    const { username, courseList } = this.state;
    courseList.splice(id, 1);
    this.setState({ courseList });
    this.props.updateCourseHandler(username, courseList);
  }

  renderBoard = (numPerRow) => {
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

    if (!numPerRow) return (
      <div style={ mobileStyles.termRowContainer }>
        <TermRow
          rowNumber={ 0 }
          courseList={ courseList }
          onClearBoard={ this.clearBoard }
          onRenameBoard={ this.renameBoard }
          onDeleteBoard={ this.deleteBoard }
          onUpdateCourses={ this.loadCourses }
          showCart
          cart={ this.state.cart }
          onClearCart={ this.onClearCart }
        />
      </div>
    );

    const numRows = Math.ceil(numTerms / numPerRow);
    return (
      <div style={ styles.termRowContainer }>
        {
          Array(numRows).fill().map((_, i) => {
            const courses = courseList.slice(i * numPerRow, (i + 1) * numPerRow);
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
    if (this.state.loading) return <LoadingView />;

    return (
      <MediaQuery minWidth={ 460 }>
        { matches => matches
          ? (
            <div style={ styles.container }>
              <MyCourseAppBar
                onAddBoard={ this.addBoard }
                onImport={ this.importTerms }
                onClear={ this.clearCourses }
                showClearButton={ this.state.courseList.length > 0 }
              />
              <MediaQuery minWidth={ 900 }>
                <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd(3) }>
                  <div style={ styles.viewContainer }>
                    <div style={ styles.boardContainer }>
                      { this.renderBoard(3) }
                    </div>
                    <MyCourseSideBar
                      cartCourses={ this.state.cart }
                      onClearCart={ this.clearCart }
                    />
                  </div>
                </DragDropContext>
              </MediaQuery>
              <MediaQuery minWidth={ 685 } maxWidth={ 900 }>
                <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd(2) }>
                  <div style={ styles.viewContainer }>
                    <div style={ styles.boardContainer }>
                      { this.renderBoard(2) }
                    </div>
                    <MyCourseSideBar
                      cartCourses={ this.state.cart }
                      onClearCart={ this.clearCart }
                    />
                  </div>
                </DragDropContext>
              </MediaQuery>
              <MediaQuery minWidth={ 460 } maxWidth={ 685 }>
                <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd(1) }>
                  <div style={ styles.viewContainer }>
                    <div style={ styles.boardContainer }>
                      { this.renderBoard(1) }
                    </div>
                    <MyCourseSideBar
                      cartCourses={ this.state.cart }
                      onClearCart={ this.clearCart }
                    />
                  </div>
                </DragDropContext>
              </MediaQuery>
              <ReactTooltip id="course-card-title" effect="solid" />
            </div>
          )
          : (
            <div style={ styles.container }>
              <MediaQuery maxWidth={ 460 }>
                <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd(0) }>
                  <MyCourseAppBar
                    onAddBoard={ this.addBoard }
                    onImport={ this.importTerms }
                    onClear={ this.clearCourses }
                    showClearButton={ this.state.courseList.length > 0 }
                    showTrashOnDrag
                    isDraggingCourse={ this.state.isDraggingCourse }
                  />
                  <div style={ mobileStyles.viewContainer }>
                    <div style={ mobileStyles.boardContainer }>
                      { this.renderBoard(0) }
                    </div>
                  </div>
                </DragDropContext>
              </MediaQuery>
            </div>
          )
        }
      </MediaQuery>
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
    setCartHandler: (username, cart) => {
      dispatch(setCart(username, cart));
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
