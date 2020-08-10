import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Helmet } from 'react-helmet';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ProfHeader from './ProfHeader';
import Review from './Review';
import WriteReview from './WriteReview';
import ErrorView from 'components/tools/ErrorView';
import LoadingView from 'components/tools/LoadingView';
import { purple, grey } from 'constants/Colours';
import { objectEquals } from 'utils/arrays';
import { getProfMetadata } from 'actions';

const styles = {
  container: (isMobile) => {
    const horPadding = isMobile ? 15 : 40;
    return {
      width: `calc(100% - ${horPadding * 2}px)`,
      height: 'calc(100% - 40px)',
      display: 'flex',
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
};

const sortFunctions = {
  Old: (r1, r2) => new Date(r1.date) - new Date(r2.date),
  New: (r1, r2) => new Date(r2.date) - new Date(r1.date),
  Highest: (r1, r2) => r2.rating - r1.rating,
  Lowest: (r1, r2) => r1.rating - r2.rating,
  Top: (r1, r2) => r2.numThumbsUp - r2.numThumbsDown - (r1.numThumbsUp - r1.numThumbsDown),
  Controversial: (r1, r2) =>
    r1.numThumbsUp - r1.numThumbsDown - (r2.numThumbsUp - r2.numThumbsDown),
};

const getProfReviews = async (profName) => {
  const response = await fetch(`/server/prof/reviews/${profName}`, {
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  if (!response.ok) return null;
  const resp = await response.json();
  return resp;
};

// Adds prof review. Returns true if successful
const addProfReview = async (profName, review) => {
  const response = await fetch(`/server/prof/reviews/${profName}/add`, {
    method: 'POST',
    body: JSON.stringify(review),
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
      'Content-Type': 'application/json',
    },
  });
  return response.ok;
};

// Deletes prof review. Returns true if successful
const deleteProfReview = async (profName) => {
  const response = await fetch(`/server/prof/reviews/${profName}/remove`, {
    method: 'DELETE',
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
    },
  });
  return response.ok;
};

// Adds prof review vote. Returns true if successful
const addVote = async (profName, data) => {
  const response = await fetch(`/server/prof/reviews/${profName}/vote`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'x-secret': process.env.REACT_APP_SERVER_SECRET,
      'Content-Type': 'application/json',
    },
  });
  return response.ok;
};

class ProfViewContainer extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    profMetadata: PropTypes.object.isRequired,
    updateMetadataHandler: PropTypes.func.isRequired,
  };

  static loadData = (match) => {
    const { profName } = match.params;
    return getProfMetadata(profName);
  };

  constructor(props) {
    super(props);

    let { name, courses, tags, rmpURL, id } = props.profMetadata;

    this.state = {
      profName: name || '',
      id: id || '',
      courses: courses || [],
      reviews: [],
      rating: 0,
      difficulty: 0,
      numRatings: 0,
      numDifficulty: 0,
      tags: tags || [],
      rmpURL: rmpURL || '',
      userReview: null,
      error: false,
      sort: 'New',
      loading: true,
    };
  }

  async componentDidMount() {
    const { profName } = this.props.match.params;
    this.updateProf(profName);
  }

  componentWillReceiveProps(nextProps) {
    const { match, profMetadata, username } = nextProps;
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

    if (this.props.match.params.profName !== match.params.profName) {
      this.updateProf(match.params.profName);
      return;
    }

    if (!objectEquals(this.props.profMetadata, profMetadata)) {
      let { name, courses, tags, rmpURL, id, error } = profMetadata;
      if (error != null) {
        this.setState({ error: true });
        return;
      }
      this.setState({
        profName: name,
        id: id || '',
        courses: courses || [],
        tags: tags || [],
        rmpURL: rmpURL || '',
        error: false,
      });
      this.updateReviews(name);
    }
  }

  async updateProf(profName) {
    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false }), 5000);
    this.props.updateMetadataHandler(profName);
  }

  async updateReviews(profName) {
    const resp = await getProfReviews(profName);
    if (resp == null) {
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
    let numDifficulty = 0;
    let totalRating = 0;
    let totalDifficulty = 0;
    let reviews = [];

    // Add reviews from ratemyprof
    if (resp.hasOwnProperty('rmp')) {
      numRatings += Object.keys(resp.rmp).length;
      const rmpReviews = Object.keys(resp.rmp).map((id) => {
        const review = resp.rmp[id];
        review.rmpURL = `${this.state.rmpURL}#${id}`;
        totalRating += review.rating;
        if (review.difficulty != null) {
          totalDifficulty += review.difficulty;
          numDifficulty++;
        }
        return review;
      });
      reviews.push(...rmpReviews);
    }

    // Add reviews from watsmymajor
    if (resp.hasOwnProperty('wmm')) {
      numRatings += Object.keys(resp.wmm).length;
      const wmmReviews = Object.keys(resp.wmm).map((id) => {
        const review = resp.wmm[id];
        review.id = id;
        totalRating += review.rating;
        if (review.difficulty != null) {
          totalDifficulty += review.difficulty;
          numDifficulty++;
        }
        let numThumbsUp = 0;
        let numThumbsDown = 0;
        for (let id in review.votes) {
          if (review.votes[id] === 1) numThumbsUp++;
          if (review.votes[id] === -1) numThumbsDown++;
        }
        review.numThumbsUp = numThumbsUp;
        review.numThumbsDown = numThumbsDown;

        // Check if this is user's review
        if (id === this.props.username) {
          this.setState({ userReview: review });
        }
        return review;
      });
      reviews.push(...wmmReviews);
    }
    reviews = reviews.sort(sortFunctions[this.state.sort]);
    const rating = Number((totalRating / numRatings).toFixed(1));
    const difficulty = Number((totalDifficulty / numDifficulty).toFixed(1));
    this.setState({ reviews, rating, difficulty, numRatings, numDifficulty, loading: false });
  }

  onChangeSort = (ev) => {
    const reviews = [...this.state.reviews].sort(sortFunctions[ev.target.value]);
    this.setState({ sort: ev.target.value, reviews });
  };

  onSubmit = async (review) => {
    const profId = this.props.match.params.profName;
    const success = await addProfReview(profId, review);
    if (!success) console.error('Failed to update prof review.');
    else this.updateReviews(this.state.profName);
  };

  onDelete = async () => {
    const profId = this.props.match.params.profName;
    const success = await deleteProfReview(profId);
    if (!success) console.error('Failed to delete prof review.');
    else this.updateReviews(this.state.profName);
  };

  onVote = (i) => async (vote) => {
    const profId = this.props.match.params.profName;
    const reviews = this.state.reviews.slice(0);
    const id = this.state.reviews[i].id;

    if (!reviews[i].hasOwnProperty('votes')) reviews[i].votes = {};
    const prevVote = reviews[i].votes[this.props.username];
    // If already voted, we unvote
    if (prevVote != null && vote === prevVote) vote = 0;

    const success = await addVote(profId, { id, vote });
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
      profName,
      id,
      courses,
      reviews,
      rating,
      difficulty,
      tags,
      numRatings,
      rmpURL,
      userReview,
      error,
      loading,
    } = this.state;
    if (error) {
      return (
        <ErrorView
          msgHeader={'Oops!'}
          msgBody={`Could not find professor id of ${this.props.match.params.profName}!`}
        />
      );
    }

    const reviewsDiv = loading ? (
      <div style={{ width: '100%', height: '100%' }}>
        <LoadingView />
      </div>
    ) : (
      <div style={styles.reviewContainer}>
        {this.props.isLoggedIn ? (
          <WriteReview
            profName={profName}
            courses={courses}
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
          <span style={styles.helpText}>
            Looks like there aren't any ratings yet. Help us out by adding a review!
          </span>
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
              subject,
              catalogNumber,
              date,
              rating,
              difficulty,
              isMandatory,
              textbookUsed,
              grade,
              comments,
              numThumbsUp,
              numThumbsDown,
              rmpURL,
              id,
            },
            i
          ) => (
            <Review
              key={rmpURL || id || i}
              subject={subject}
              catalogNumber={catalogNumber}
              date={date}
              rating={rating}
              difficulty={difficulty}
              isMandatory={isMandatory}
              textbookUsed={textbookUsed}
              grade={grade}
              comments={comments}
              numThumbsUp={numThumbsUp}
              numThumbsDown={numThumbsDown}
              rmpURL={rmpURL}
              onVote={this.onVote(i)}
            />
          )
        )}
      </div>
    );

    const pageTitle = `${profName} | University of Waterloo - WatsMyMajor`;
    const pageDescription = `${profName} - ${tags.join(', ')} (${numRatings} ratings)`;
    const pageKeywords = [
      profName,
      'uw',
      'uwaterloo',
      'waterloo',
      'prof',
      'professor',
      ...tags,
      ...courses.map(({ subject, catalogNumber }) => subject + ' ' + catalogNumber),
    ];

    return (
      <MediaQuery minWidth={400}>
        {(matches) => {
          const isMobile = global.isMobile != null ? global.isMobile : !matches;
          return (
            <div style={{ width: '100%', display: 'flex' }}>
              <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={pageKeywords} />
                <meta property="og:url" content={`https://www.watsmymajor.com/professors/${id}`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta
                  property="og:image"
                  content="https://user-images.githubusercontent.com/19257435/59579321-5233ca80-909a-11e9-855e-547cd83eeb91.png"
                />
              </Helmet>
              <div style={styles.container(isMobile)}>
                <ProfHeader
                  profName={profName}
                  numRatings={numRatings}
                  rating={rating}
                  difficulty={difficulty}
                  tags={tags}
                  rmpURL={rmpURL}
                  courses={courses}
                />
                {reviewsDiv}
              </div>
            </div>
          );
        }}
      </MediaQuery>
    );
  }
}

const mapStateToProps = ({ isLoggedIn, user, profMetadata }) => ({
  isLoggedIn,
  username: user.username,
  profMetadata,
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateMetadataHandler: (profId) => dispatch(getProfMetadata(profId)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfViewContainer));
