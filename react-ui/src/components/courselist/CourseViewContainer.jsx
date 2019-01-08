import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import CourseContent from './content/CourseContent';
import ClassDetails from './classes/ClassDetailsContainer';
import PrereqsTree from './tree/PrerequisitesTreeContainer';
import LoadingView from '../tools/LoadingView';
import ErrorView from '../tools/ErrorView';
import { fireLoginPrompt } from '../tools/LoginPrompt';
import { objectEquals, arrayOfObjectEquals } from 'utils/arrays';
import { hasTakenCourse, isInCart, canTakeCourse } from 'utils/courses';
import {
  createSnack,
  addToCart,
  removeFromCart,
  watchClass,
  unwatchClass,
} from 'actions';
import 'stylesheets/CourseView.css';

const styles = {
  courseView: {
    width: '100%',
    display: 'flex',
  }
};

const defaultCourse = {
  title: '',
  description: '',
  rating: 0,
  url: '',
  termsOffered: [],
  crosslistings: '',
  antireqs: [],
  coreqs: [],
  prereqs: {},
  postreqs: [],
  term: '',
};

const defaultClassInfo = {
  units: 0,
  topic: '',
  note: '',
  classNumber: 0,
  section: '',
  campus: '',
  enrollmentCap: 0,
  enrollmentTotal: 0,
  waitingCap: 0,
  waitingTotal: 0,
  reserveCap: 0,
  reserveTotal: 0,
  reserveGroup: '',
  classes: [],
  isTBA: false,
  isCancelled: false,
  isClosed: false,
  lastUpdated: ''
};

// Duplicated from server/core/scrapers/classes.js
const createAdmURL = (subject, catalogNumber, term) => {
  const level = (catalogNumber.length < 3 || (catalogNumber.charAt(0) <= 4)) ? 'under' : 'grad';
  subject = subject.toUpperCase();
  catalogNumber = catalogNumber.toUpperCase();
  return `http://www.adm.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?level=${level}&sess=${term}&subject=${subject}&cournum=${catalogNumber}`;
}

const getCourseData = async (subject, catalogNumber) => {
  const response = await fetch(`/server/courses/info/${subject}/${catalogNumber}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) {
    throw new Error(`status ${response.status}`);
  }
  return await response.json();
};

const getCourseClasses = async (subject, catalogNumber, term) => {
  const response = await fetch(`/server/courses/classes/${term}/${subject}/${catalogNumber}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) {
    throw new Error(`status ${response.status}`);
  }
  return await response.json();
};

class CourseViewContainer extends Component {

  static propTypes = {
    myCourses: PropTypes.object.isRequired,
    cart: PropTypes.array.isRequired,
    watchlist: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    addToCartHandler: PropTypes.func.isRequired,
    removeFromCartHandler: PropTypes.func.isRequired,
    watchClassHandler: PropTypes.func.isRequired,
    unwatchClassHandler: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { subject, catalogNumber } = props.match.params;

    this.state = {
      subject: subject.toUpperCase(),
      catalogNumber,
      term: process.env.REACT_APP_CURRENT_TERM,
      admURL: '',
      courseLoading: true,
      classLoading: true,
      error: false,
      classModalOpen: false,
      taken: hasTakenCourse(subject, catalogNumber, props.myCourses),
      inCart: isInCart(subject, catalogNumber, props.cart),
      eligible: false,
      course: defaultCourse,
      classes: [],
      classInfo: defaultClassInfo,
      watchlist: {},
    }

    this.onExpandClass = this.onExpandClass.bind(this);
    this.closeClassModal = this.closeClassModal.bind(this);
    this.updatePageInfo = this.updatePageInfo.bind(this);
    this.viewCart = this.viewCart.bind(this);
    this.addCourseToCart = this.addCourseToCart.bind(this);
    this.removeCourseFromCart = this.removeCourseFromCart.bind(this);
    this.onWatchClass = this.onWatchClass.bind(this);
    this.onUnwatchClass = this.onUnwatchClass.bind(this);
  }

  componentDidMount() {
    const { subject, catalogNumber, term } = this.state;
    const admURL = createAdmURL(subject, catalogNumber, term);
    this.setState({ admURL });
    this.updatePageInfo(subject, catalogNumber);
    this.updateWatchlist(this.props.watchlist);
  }

  componentWillReceiveProps(nextProps) {
    const { subject, catalogNumber } = this.props.match.params;
    const nextSubject = nextProps.match.params.subject;
    const nextCatNum = nextProps.match.params.catalogNumber;
    const updatedCart = !arrayOfObjectEquals(nextProps.cart, this.props.cart);
    const updatedUserCourses = !objectEquals(nextProps.myCourses, this.props.myCourses);
    const updatedWatchlist = !objectEquals(nextProps.watchlist, this.props.watchlist);
    const isNewCourse = (subject !== nextSubject || catalogNumber !== nextCatNum);

    // Don't want class info from previous class
    if (isNewCourse) this.closeClassModal();

    // User selected new course
    if (isNewCourse) {
      const { myCourses, cart } = nextProps;
      const taken = hasTakenCourse(nextSubject, nextCatNum, myCourses);
      const inCart = isInCart(nextSubject, nextCatNum, cart);
      this.setState({ courseLoading: true, classLoading: true, taken, inCart });
      this.updatePageInfo(nextSubject, nextCatNum);
    }

    // User courses are updated
    if (updatedUserCourses) {
      const { myCourses } = nextProps;
      const taken = hasTakenCourse(nextSubject, nextCatNum, myCourses);
      this.setState({ taken });
    }

    // User's cart is updated
    if (updatedCart) {
      const { cart } = nextProps;
      const inCart = isInCart(nextSubject, nextCatNum, cart);
      this.setState({ inCart });
    }

    if (updatedWatchlist) this.updateWatchlist(nextProps.watchlist);
  }

  updateWatchlist(watchlist) {
    let { isLoggedIn } = this.props;
    if (!isLoggedIn) return;
    watchlist = watchlist[this.state.term] || {};
    this.setState({ watchlist });
  }

  async updatePageInfo(subject, catalogNumber) {
    this.setState({ subject, catalogNumber });
    if (!subject || !catalogNumber) {
      this.setState({
        courseLoading: false,
        classLoading: false,
        error: 'Invalid course name',
      });
      return;
    }

    this.fetchCourseData(subject, catalogNumber);
    this.fetchClasses(subject, catalogNumber);
  }

  async fetchCourseData(subject, catalogNumber) {
    try {
      const json = await getCourseData(subject, catalogNumber);
      let {
        description,
        crosslistings,
        notes,
        terms,
        title,
        units,
        url,
        rating,
        prereqs,
        coreqs,
        antireqs,
        postreqs,
      } = json;

      // Update page title
      document.title = `${subject} ${catalogNumber} | ${title} | University of Waterloo - WatsMyMajor`;
      const course = {
        title,
        description,
        rating,
        url,
        notes,
        units,
        terms,
        crosslistings,
        antireqs,
        coreqs,
        prereqs,
        postreqs,
      };

      const eligible = canTakeCourse(this.props.myCourses, prereqs, coreqs, antireqs);

      this.setState({ courseLoading: false, course, eligible });
    } catch(error) {
      console.error(`ERROR: ${error}`);
      this.setState({ courseLoading: false, error });
    }
  }

  async fetchClasses(subject, catalogNumber) {
    try {
      const classes = await getCourseClasses(subject, catalogNumber, this.state.term) || [];
      this.setState({ classLoading: false, classes });
    } catch (error) {
      console.error(`ERROR: ${error}`);
      this.setState({ classLoading: false });
      toast.error('Failed to load classes.');
    }
  }

  viewCart() {
    this.props.history.push('/my-courses');
  }

  addCourseToCart(subject, catalogNumber) {
    const { addToCartHandler, username, isLoggedIn, cart, history, location } = this.props;
    const { taken } = this.state;
    if (!isLoggedIn) fireLoginPrompt(history, location.pathname);
    else addToCartHandler(username, cart, subject, catalogNumber, taken, this.viewCart);
  }

  removeCourseFromCart(subject, catalogNumber) {
    const { removeFromCartHandler, username, cart } = this.props;
    removeFromCartHandler(username, cart, subject, catalogNumber);
  }

  onExpandClass(classInfo) {
    this.setState({ classModalOpen: true, classInfo });
  }

  closeClassModal() {
    this.setState({ classModalOpen: false, classInfo: defaultClassInfo });
  }

  onWatchClass(classNum) {
    const { history, location, isLoggedIn, username } = this.props;
    const { term } = this.state;
    if (isLoggedIn) this.props.watchClassHandler(username, term, classNum);
    else fireLoginPrompt(history, location.pathname);
  }

  onUnwatchClass(classNum) {
    const { history, location, isLoggedIn, username } = this.props;
    const { term } = this.state;
    if (isLoggedIn) this.props.unwatchClassHandler(username, term, classNum);
    else fireLoginPrompt(history, location.pathname);
  }

  render() {
    let {
      subject,
      catalogNumber,
      course,
      term,
      admURL,
      classes,
      watchlist,
      taken,
      inCart,
      eligible,
      classInfo,
      classModalOpen,
      courseLoading,
      error
    } = this.state;
    if (!this.props.isLoggedIn) {
      taken = false;
      inCart = false;
      eligible = false;
    }

    const renderedCourseView = (
      <div style={ styles.courseView }>
        <CourseContent
          subject={ subject }
          catalogNumber={ catalogNumber }
          course={ course }
          term={ term }
          classes={ classes }
          expandClass={ this.onExpandClass }
          taken={ taken }
          inCart={ inCart }
          eligible={ eligible }
          addToCartHandler={ this.addCourseToCart }
          removeFromCartHandler={ this.removeCourseFromCart }
        />
        <ClassDetails
          classInfo={ classInfo }
          watchlist={ watchlist }
          admURL={ admURL }
          open={ classModalOpen }
          onClose={ this.closeClassModal }
          onWatch={ this.onWatchClass }
          onUnwatch={ this.onUnwatchClass }
        />
      </div>
    );

    const courseView = (courseLoading)
      ? <LoadingView />
      : (error)
        ? (
          <ErrorView
            msgHeader={ "Oops!" }
            msgBody={ `${subject} ${catalogNumber} is not a valid course!` }
          />
        )
        : renderedCourseView;

    const prereqsTree = <PrereqsTree subject={ subject } catalogNumber={ catalogNumber } />;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Route
          path={ `${this.props.match.path}` }
          exact
          render={ () => courseView }
        />
        <Route
          path={ `${this.props.match.path}/tree/prereqs` }
          render={ () => prereqsTree }
        />
      </div>
    );
  }

}

const mapStateToProps = ({ myCourses, cart, watchlist, user, isLoggedIn }) => ({
  myCourses,
  cart,
  watchlist,
  username: user.username,
  isLoggedIn,
});

const mapDispatchToProps = dispatch => {
  return {
    addToCartHandler: (username, cart, subject, catalogNumber, hasTaken, viewCartHandler) => {
      if (hasTaken) {
        const msg = `${subject} ${catalogNumber} is already in your courses.`;
        dispatch(createSnack(msg));
      } else {
        const msg = `${subject} ${catalogNumber} has been added to your cart.`;
        const actionMsg = 'View Cart';
        dispatch(addToCart(subject, catalogNumber, username, cart));
        dispatch(createSnack(msg, actionMsg, null, viewCartHandler));
      }
    },
    removeFromCartHandler: (username, cart, subject, catalogNumber) => {
      const msg = `${subject} ${catalogNumber} has been removed from your cart.`;
      const actionMsg = 'undo';
      const undoMsg = `${subject} ${catalogNumber} has been re-added to your cart.`;
      const handleActionClick = () => dispatch(addToCart(subject, catalogNumber, username, cart));
      dispatch(removeFromCart(subject, catalogNumber, username, cart));
      dispatch(createSnack(msg, actionMsg, undoMsg, handleActionClick));
    },
    watchClassHandler: (username, term, classNum) => dispatch(watchClass(username, term, classNum)),
    unwatchClassHandler: (username, term, classNum) => dispatch(unwatchClass(username, term, classNum)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseViewContainer));
