import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LoadingView from 'components/tools/LoadingView';
import WriteReview from './WriteReview';
import Review from './Review';
import Resources from './Resources';
import { purple, grey } from 'constants/Colours';

const styles = {
  container: (isMobile) => {
    const horPadding = isMobile ? 15 : 20;
    return {
      width: `calc(100% - ${horPadding * 2}px)`,
      height: 'calc(100% - 40px)',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      padding: `20px ${horPadding}px`,
    };
  },
  reviewContainer: {
    margin: '20px auto',
    maxWidth: 800,
  },
  helpText: {
    color: grey,
  },
  login: {
    margin: '10px auto',
    color: grey,
  },
  sortContainer: {
    display: 'inline-block',
    float: 'left',
    minWidth: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
  },
  subtitle: {
    color: grey,
    marginLeft: 10,
  },
};

const getRating = (r) => r.easy + r.useful + r.interesting;

const sortFunctions = {
  Old: (r1, r2) => new Date(r1.date) - new Date(r2.date),
  New: (r1, r2) => new Date(r2.date) - new Date(r1.date),
  Highest: (r1, r2) => getRating(r2) - getRating(r1),
  Lowest: (r1, r2) => getRating(r1) - getRating(r2),
  Top: (r1, r2) => r2.numThumbsUp - r2.numThumbsDown - (r1.numThumbsUp - r1.numThumbsDown),
  Controversial: (r1, r2) =>
    r1.numThumbsUp - r1.numThumbsDown - (r2.numThumbsUp - r2.numThumbsDown),
};

const getCourseReviews = async (subject, catalogNumber) => {
  const response = await fetch(`/server/courses/reviews/${subject}/${catalogNumber}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  if (!response.ok) return null;
  const resp = await response.json();
  return resp;
};

// Adds course review. Returns true if successful
const addCourseReview = async (subject, catalogNumber, review) => {
  const response = await fetch(`/server/courses/reviews/${subject}/${catalogNumber}/add`, {
    method: 'POST',
    body: JSON.stringify(review),
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
      'Content-Type': 'application/json',
    },
  });
  return response.ok;
};

// Deletes course review. Returns true if successful
const deleteCourseReview = async (subject, catalogNumber) => {
  const response = await fetch(`/server/courses/reviews/${subject}/${catalogNumber}/remove`, {
    method: 'DELETE',
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  return response.ok;
};

const getProfList = async (subject, catalogNumber) => {
  const response = await fetch(`/server/prof/list/${subject}/${catalogNumber}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  if (!response.ok) return null;
  const resp = await response.json();
  return resp;
};

const getProfId = async (name) => {
  const response = await fetch(`/server/prof/id/${name}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  if (!response.ok) return null;
  const resp = await response.json();
  return resp;
};

// Adds course review vote. Returns true if successful
const addVote = async (subject, catalogNumber, data) => {
  const response = await fetch(`/server/courses/reviews/${subject}/${catalogNumber}/vote`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
      'Content-Type': 'application/json',
    },
  });
  return response.ok;
};

class CourseReviewContainer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    catalogNumber: PropTypes.string.isRequired,
  };

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      subject: props.subject,
      catalogNumber: props.catalogNumber,
      profs: [],
      reviews: [],
      resources: [],
      userReview: null,
      sort: 'New',
      loading: true,
      error: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { subject, catalogNumber } = this.state;
    this.updatePage(subject, catalogNumber);
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.timer != null) clearTimeout(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    const { subject, catalogNumber, username } = this.state;
    if (username !== this.props.username) {
      let userReview = null;
      const { reviews } = this.state;

      // Check if user has reviewed this prof
      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].id === nextProps.username) {
          userReview = reviews[i];
          break;
        }
      }
      this.setState({ userReview });
    }
    if (subject !== nextProps.subject || catalogNumber !== nextProps.catalogNumber) {
      this.updatePage(nextProps.subject, nextProps.catalogNumber);
    }
  }

  async updatePage(subject, catalogNumber) {
    if (this._isMounted) this.setState({ subject, catalogNumber, loading: true });
    this.timer = setTimeout(() => this.setState({ loading: false }), 5000);
    this.updateReviews(subject, catalogNumber);
    const profs = await getProfList(subject, catalogNumber);
    if (this._isMounted && profs != null) this.setState({ profs });
  }

  async updateReviews(subject, catalogNumber) {
    try {
      const resp = await getCourseReviews(subject, catalogNumber);
      if (this._isMounted && resp == null) {
        this.setState({
          reviews: [],
          rating: 0,
          difficulty: 0,
          numRatings: 0,
          numDifficulty: 0,
          loading: false,
        });
        return;
      }

      let numRatings = 0;
      let reviews = [];
      const resources = [];

      // Add reviews from birdcourses
      if (resp.hasOwnProperty('bird')) {
        numRatings += Object.keys(resp.bird).length;
        const birdUrl = `https://birdcourses.com/course.php?courseid=${resp.bird.id}`;
        const birdReviews = resp.bird.reviews.map((review) => {
          review.birdURL = birdUrl;
          return review;
        });
        numRatings += birdReviews.length;
        reviews.push(...birdReviews);
      }

      // Add reviews from watsmymajor
      if (resp.hasOwnProperty('wmm')) {
        numRatings += Object.keys(resp.wmm).length;
        let wmmReviews = Object.keys(resp.wmm).map(async (id) => {
          const review = resp.wmm[id];
          review.id = id;
          if (review.hasOwnProperty('prof')) {
            const profId = await getProfId(review.prof);
            review.profId = profId;
          }
          let numThumbsUp = 0;
          let numThumbsDown = 0;
          for (let id in review.votes) {
            if (review.votes[id] === 1) numThumbsUp++;
            if (review.votes[id] === -1) numThumbsDown++;
          }
          review.numThumbsUp = numThumbsUp;
          review.numThumbsDown = numThumbsDown;

          // Add useful resources
          if (review.hasOwnProperty('resources')) {
            resources.push(...review.resources);
          }

          // Check if this is user's review
          if (this._isMounted && id === this.props.username) {
            this.setState({ userReview: review });
          }
          return review;
        });
        wmmReviews = await Promise.all(wmmReviews);
        reviews.push(...wmmReviews);
      }

      reviews = reviews.sort(sortFunctions[this.state.sort]);
      if (this._isMounted) this.setState({ resources, reviews, numRatings, loading: false });
    } catch (e) {
      console.error(e);
    }
  }

  onChangeSort = (ev) => {
    const reviews = [...this.state.reviews].sort(sortFunctions[ev.target.value]);
    this.setState({ sort: ev.target.value, reviews });
  };

  onSubmit = async (review) => {
    const { subject, catalogNumber } = this.state;
    const success = await addCourseReview(subject, catalogNumber, review);
    if (!success) console.error('Failed to update course review.');
    else this.updateReviews(subject, catalogNumber);
  };

  onDelete = async () => {
    const { subject, catalogNumber } = this.state;
    const success = await deleteCourseReview(subject, catalogNumber);
    if (!success) console.error('Failed to delete course review.');
    else {
      this.setState({ userReview: null });
      this.updateReviews(subject, catalogNumber);
    }
  };

  onVote = (i) => async (vote) => {
    const { subject, catalogNumber } = this.state;
    const reviews = this.state.reviews.slice(0);
    const id = this.state.reviews[i].id;

    if (!reviews[i].hasOwnProperty('votes')) reviews[i].votes = {};
    const prevVote = reviews[i].votes[this.props.username];
    // If already voted, we unvote
    if (prevVote != null && vote === prevVote) vote = 0;

    const success = await addVote(subject, catalogNumber, { id, vote });
    if (!success) console.error('Failed to add vote.');
    else {
      // Update review thumbs
      reviews[i].votes[this.props.username] = vote;
      let numThumbsUp = 0;
      let numThumbsDown = 0;
      for (let id in reviews[i].votes) {
        if (reviews[i].votes[id] === 1) numThumbsUp++;
        if (reviews[i].votes[id] === -1) numThumbsDown++;
      }
      reviews[i].numThumbsUp = numThumbsUp;
      reviews[i].numThumbsDown = numThumbsDown;
      this.setState({ reviews });
    }
  };

  render() {
    const {
      subject,
      catalogNumber,
      profs,
      reviews,
      resources,
      userReview,
      numRatings,
      loading,
    } = this.state;

    if (loading)
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <LoadingView />
        </div>
      );

    return (
      <MediaQuery minWidth={400}>
        {(matches) => {
          const isMobile = global.isMobile != null ? global.isMobile : !matches;
          const numRatingsText = numRatings === 1 ? '1 rating' : `${numRatings} ratings`;
          return (
            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap-reverse' }}>
              <div style={{ width: '100%', maxWidth: 760 }}>
                <div style={styles.container(isMobile)}>
                  <div style={{ width: 'fit-content', marginBottom: 10 }}>
                    <span style={styles.title}>Reviews</span>
                    {numRatings != null && <span style={styles.subtitle}>{numRatingsText}</span>}
                  </div>
                  <div style={{ width: '100%' }}>
                    {this.props.isLoggedIn ? (
                      <WriteReview
                        subject={subject}
                        catalogNumber={catalogNumber}
                        profs={profs}
                        onSubmit={this.onSubmit}
                        onDelete={this.onDelete}
                        userReview={userReview}
                      />
                    ) : (
                      <div style={styles.login}>
                        <span>
                          <Link
                            to={{
                              pathname: '/login',
                              state: {
                                from: this.props.location.pathname,
                              },
                            }}
                          >
                            Login
                          </Link>{' '}
                          to write a review!
                        </span>
                      </div>
                    )}
                    {numRatings === 0 ? (
                      this.props.isLoggedIn ? (
                        <span style={styles.helpText}>
                          Looks like there aren't any ratings yet. Help us out by adding a review!
                        </span>
                      ) : null
                    ) : (
                      <div style={styles.sortContainer}>
                        <span style={{ marginRight: 7 }}>Sort By:</span>
                        <Select
                          style={{ color: purple, fontWeight: 400 }}
                          value={this.state.sort}
                          onChange={this.onChangeSort}
                          inputProps={{
                            id: 'sort',
                          }}
                          autoWidth
                        >
                          <MenuItem value="New">New</MenuItem>
                          <MenuItem value="Old">Old</MenuItem>
                          <MenuItem value="Highest">Highest Rated</MenuItem>
                          <MenuItem value="Lowest">Lowest Rated</MenuItem>
                          <MenuItem value="Top">Top</MenuItem>
                          <MenuItem value="Controversial">Controversial</MenuItem>
                        </Select>
                      </div>
                    )}
                    {reviews.map(
                      (
                        {
                          id,
                          date,
                          prof,
                          profId,
                          term,
                          year,
                          interesting,
                          useful,
                          easy,
                          difficulty,
                          isMandatory,
                          textbookUsed,
                          grade,
                          comments,
                          advice,
                          numThumbsUp,
                          numThumbsDown,
                          birdURL,
                        },
                        i
                      ) => (
                        <Review
                          key={id || i}
                          date={date}
                          prof={prof}
                          profId={profId}
                          term={term}
                          year={year}
                          interesting={interesting}
                          useful={useful}
                          easy={easy}
                          difficulty={difficulty}
                          isMandatory={isMandatory}
                          textbookUsed={textbookUsed}
                          grade={grade}
                          comments={comments}
                          advice={advice}
                          numThumbsUp={numThumbsUp}
                          numThumbsDown={numThumbsDown}
                          birdURL={birdURL}
                          onVote={this.onVote(i)}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
              <Resources resources={resources} />
            </div>
          );
        }}
      </MediaQuery>
    );
  }
}

const mapStateToProps = ({ isLoggedIn, user }) => ({
  isLoggedIn,
  username: user.username,
});

export default withRouter(connect(mapStateToProps)(CourseReviewContainer));
