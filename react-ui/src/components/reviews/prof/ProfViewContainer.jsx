import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ProfHeader from './ProfHeader';
import Review from './Review';
import WriteReview from './WriteReview';
import ErrorView from 'components/tools/ErrorView';
import LoadingView from 'components/tools/LoadingView';
import { purple, grey } from 'constants/Colours';

const styles = {
  container: (isMobile) => {
    const horPadding = (isMobile) ? 15 : 40;
    return {
      width: `calc(100% - ${horPadding * 2}px)`,
      height: 'calc(100% - 40px)',
      display: 'flex',
      flexWrap: 'wrap',
      padding: `20px ${horPadding}px`,
    }
  },
  reviewContainer: {
    margin: '20px auto',
    maxWidth: 800,
  },
  helpText: {
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
  'Old': (r1, r2) => new Date(r1.date) - new Date(r2.date),
  'New': (r1, r2) => new Date(r2.date) - new Date(r1.date),
  'Highest': (r1, r2) => r2.overallScore - r1.overallScore,
  'Lowest': (r1, r2) => r1.overallScore - r2.overallScore,
  'Top': (r1, r2) => (r2.numThumbsUp-r2.numThumbsDown) - (r1.numThumbsUp-r1.numThumbsDown),
  'Controversial': (r1, r2) => (r1.numThumbsUp-r1.numThumbsDown) - (r2.numThumbsUp-r2.numThumbsDown),
};


const getProfInfo = async (profName) => {
  const response = await fetch(`/server/prof/info/${profName}`, {
    headers: {
      "x-secret": process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) return null;

  const info = await response.json();
  if (info == null) return null;
  return info;
}

const getProfReviews = async (profName) => {
  const response = await fetch(`/server/prof/reviews/${profName}`, {
    headers: {
      "x-secret": process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) return null;
  const resp = await response.json();
  return resp;
}


class ProfViewContainer extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      profName: '',
      courses: [],
      reviews: [],
      rating: 0,
      difficulty: 0,
      numRatings: 0,
      tags: [],
      rmpURL: '',
      error: false,
      sort: 'New',
      loading: true,
    };
  }

  async componentDidMount() {
    const { profName } = this.props.match.params;
    const info = await getProfInfo(profName);
    if (info == null) {
      this.setState({ error: true, loading: false });
      return;
    }
    let {
      name,
      courses,
      rating,
      difficulty,
      numRatings,
      tags,
      rmpURL
    } = info;
    this.setState({
      profName: name,
      courses: courses || [],
      rating: rating || 0,
      difficulty: difficulty || 0,
      numRatings: numRatings || 0,
      tags: tags || [],
      rmpURL: rmpURL || '',
    });

    const resp = await getProfReviews(profName);
    if (resp != null && resp.hasOwnProperty('rmp')) {
      let reviews = Object.keys(resp.rmp).map(id => {
        const review = resp.rmp[id];
        review.rmpURL = `${rmpURL}#${id}`;
        return review;
      });
      reviews = reviews.sort(sortFunctions['New']);
      this.setState({ reviews, loading: false });
    } else this.setState({ loading: false });
  }

  onChangeSort = (ev) => {
    const reviews = [...this.state.reviews].sort(sortFunctions[ev.target.value]);
    this.setState({ sort: ev.target.value, reviews });
  };

  render() {
    const {
      profName,
      reviews,
      rating,
      difficulty,
      tags,
      numRatings,
      rmpURL,
      error,
      loading
    } = this.state;
    if (error) {
      return (
        <ErrorView
          msgHeader={ "Oops!" }
          msgBody={ `Could not find ${this.props.match.params.profName}!` }
        />
      );
    }

    const reviewsDiv = (loading)
      ? (
        <div style={{ width: '100%', height: '100%' }}>
          <LoadingView />
        </div>
      )
      : (
        <div style={ styles.reviewContainer }>
          { numRatings === 0 && (
            <span style={ styles.helpText }>Looks like there aren't any ratings yet.  Help us out by adding a review!</span>
          ) }
          <WriteReview />
          { numRatings > 0 && (
            <div style={ styles.sortContainer }>
              <span style={{ marginRight: 7 }}>Sort By:</span>
              <Select
                style={{ color: purple, fontWeight: 400 }}
                value={ this.state.sort }
                onChange={ this.onChangeSort }
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
          {
            reviews.map(({
              subject,
              catalogNumber,
              date,
              overallScore,
              difficulty,
              isMandatory,
              textbookUsed,
              grade,
              comments,
              numThumbsUp,
              numThumbsDown,
              rmpURL,
            }, i) => (
              <Review
                key={ i }
                subject={ subject }
                catalogNumber={ catalogNumber }
                date={ date }
                overallScore={ overallScore }
                difficulty={ difficulty }
                isMandatory={ isMandatory }
                textbookUsed={ textbookUsed }
                grade={ grade }
                comments={ comments }
                numThumbsUp={ numThumbsUp }
                numThumbsDown={ numThumbsDown }
                rmpURL={ rmpURL }
              />
            ))
          }
        </div>
      );

    return (
      <MediaQuery minWidth={ 400 }>
        { matches => {
          const isMobile = (global.isMobile != null) ? global.isMobile : !matches;
          return (
            <div style={{ width: '100%', display: 'flex' }}>
              <div style={ styles.container(isMobile) }>
                <ProfHeader
                  profName={ profName }
                  numRatings={ numRatings }
                  rating={ rating }
                  difficulty={ difficulty }
                  tags={ tags }
                  rmpURL={ rmpURL }
                />
                { reviewsDiv }
              </div>
            </div>
          );
        } }
      </MediaQuery>
    );
  }

}

export default withRouter(ProfViewContainer);
