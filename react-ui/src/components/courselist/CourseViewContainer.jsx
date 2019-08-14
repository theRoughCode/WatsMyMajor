import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import CourseContent from './content/CourseContent';
import ClassDetails from './classes/ClassDetailsContainer';
import PrereqsTree from './tree/PrerequisitesTreeContainer';
import ErrorView from '../tools/ErrorView';
import LoadingView from '../tools/LoadingView';
import { fireLoginPrompt } from '../tools/LoginPrompt';
import { objectEquals, arrayOfObjectEquals } from 'utils/arrays';
import { hasTakenCourse, isInCart, canTakeCourse } from 'utils/courses';
import {
  createSnack,
  addToCart,
  removeFromCart,
  watchClass,
  unwatchClass,
  getCourseMetadata,
  getCourseClasses,
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
  rating: {
    avgRating: 0,
    numRatings: 0,
  },
  url: '',
  termsOffered: [],
  crosslistings: '',
  antireqs: [],
  coreqs: [],
  prereqs: {},
  postreqs: [],
  terms: [],
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

class CourseViewContainer extends Component {

  static propTypes = {
    courseMetadata: PropTypes.object.isRequired,
    courseClasses: PropTypes.array.isRequired,
    myCourses: PropTypes.object.isRequired,
    cart: PropTypes.array.isRequired,
    watchlist: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    addToCartHandler: PropTypes.func.isRequired,
    removeFromCartHandler: PropTypes.func.isRequired,
    watchClassHandler: PropTypes.func.isRequired,
    unwatchClassHandler: PropTypes.func.isRequired,
    updateMetadataHandler: PropTypes.func.isRequired,
    updateClassesHandler: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  static loadData = (match) => {
    const { subject, catalogNumber } = match.params;
    return getCourseMetadata(subject, catalogNumber);
  };

  constructor(props) {
    super(props);

    const { subject, catalogNumber } = props.match.params;

    let course = defaultCourse;
    let eligible = false;
    let loading = false;
    let error = false;
    if (Object.keys(this.props.courseMetadata).length > 0) {
      const parsedData = this.updateMetadata(subject, catalogNumber, this.props.courseMetadata);
      if (parsedData != null) {
        if (parsedData.error) error = true;
        else ({ course, eligible, loading } = parsedData);
      }
    }

    this.state = {
      subject: subject.toUpperCase(),
      catalogNumber,
      term: process.env.REACT_APP_CURRENT_TERM || process.env.CURRENT_TERM,
      admURL: '',
      error,
      classModalOpen: false,
      taken: hasTakenCourse(subject, catalogNumber, props.myCourses),
      inCart: isInCart(subject, catalogNumber, props.cart),
      eligible,
      course,
      classes: [],
      classInfo: defaultClassInfo,
      watchlist: {},
      loading,
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
    if (Object.keys(this.props.courseMetadata).length === 0) this.props.updateMetadataHandler(subject, catalogNumber);
    this.updateWatchlist(this.props.watchlist);
    this.props.updateClassesHandler(subject, catalogNumber, this.state.term);
  }

  componentWillReceiveProps(nextProps) {
    const { subject, catalogNumber } = this.props.match.params;
    const nextSubject = nextProps.match.params.subject;
    const nextCatNum = nextProps.match.params.catalogNumber;
    const updatedMetadata = !objectEquals(this.state.course, nextProps.courseMetadata);
    const updatedClasses = !arrayOfObjectEquals(this.state.classes, nextProps.courseClasses);
    const updatedCart = !arrayOfObjectEquals(nextProps.cart, this.props.cart);
    const updatedUserCourses = !objectEquals(nextProps.myCourses, this.props.myCourses);
    const updatedWatchlist = !objectEquals(nextProps.watchlist, this.props.watchlist);
    const isNewCourse = (subject !== nextSubject || catalogNumber !== nextCatNum);


    // User selected new course
    if (isNewCourse) {
      // Don't want class info from previous class
      this.closeClassModal();
      this.setState({ loading: true });
      setTimeout(() => this.setState({ loading: false }), 5000);

      const { myCourses, cart } = nextProps;
      const taken = hasTakenCourse(nextSubject, nextCatNum, myCourses);
      const inCart = isInCart(nextSubject, nextCatNum, cart);
      this.setState({ taken, inCart });
      this.updatePageInfo(nextSubject, nextCatNum);
    }

    if (updatedMetadata) {
      const data = this.updateMetadata(nextSubject, nextCatNum, nextProps.courseMetadata);
      if (data != null) this.setState(data);
    }
    if (updatedClasses) this.setState({ classes: nextProps.courseClasses, loading: false });

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

  updatePageInfo(subject, catalogNumber) {
    this.setState({ subject, catalogNumber });
    if (!subject || !catalogNumber) {
      this.setState({ error: 'Invalid course name' });
      return;
    }

    this.props.updateMetadataHandler(subject, catalogNumber);
    this.props.updateClassesHandler(subject, catalogNumber, this.state.term);
  }

  // Cannot modify state because we want to be able to call this in constructor
  updateMetadata(subject, catalogNumber, metadata) {
    if (metadata == null || Object.keys(metadata).length === 0) return null;
    if (metadata.hasOwnProperty('err')) return { error: true };

    subject = subject.toUpperCase();

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
    } = metadata;

    // Update page title
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
    return { course, eligible, loading: false, error: false };
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
      error,
      loading,
    } = this.state;

    if (loading) return <LoadingView />;

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

    const courseView = (error)
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

const mapStateToProps = ({
  myCourses,
  cart,
  watchlist,
  user,
  isLoggedIn,
  courseMetadata,
  courseClasses,
}) => ({
  myCourses,
  cart,
  watchlist,
  username: user.username,
  isLoggedIn,
  courseMetadata,
  courseClasses,
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
    updateMetadataHandler: (subject, catalogNumber) => dispatch(getCourseMetadata(subject, catalogNumber)),
    updateClassesHandler: (subject, catalogNumber, term) => dispatch(getCourseClasses(subject, catalogNumber, term)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseViewContainer));
