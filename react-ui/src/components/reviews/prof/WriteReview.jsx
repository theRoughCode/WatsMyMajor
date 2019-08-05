import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import StarRatings from 'react-star-ratings';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import { objectEquals } from 'utils/arrays';
import { white, purple, yellow, red } from 'constants/Colours';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    width: '100%',
  },
  courseField: {
    minWidth: 100,
    margin: 7,
  },
  textField: {
    margin: '10px 7px',
    width: '100%',
  },
  deleteBtn: {
    backgroundColor: red,
    color: white,
    marginRight: 7,
  },
  submitBtn: {
    backgroundColor: purple,
    color: white,
    marginRight: 7,
  },
  openBtn: {
    backgroundColor: purple,
    color: white,
    float: 'right',
  },
  closeBtn: {
    backgroundColor: red,
    color: white,
    float: 'right',
  },
  stars: {
    starRatedColor: yellow,
    starDimension: '25px',
    starSpacing: '2px'
  },
  expansionPanel: {
    maxWidth: 300,
    border: '1px solid rgba(0, 0, 0, .2)',
    boxShadow: 'none',
  },
  expansionDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  difficulty: {
    margin: 7,
    maxWidth: 200,
  },
  mandatory: {
    margin: 10,
  },
  errorText: {
    color: red,
    fontSize: 12,
    marginTop: 5
  }
};

const MAX_WORDS = 500;

export default class WriteReview extends Component {

  static propTypes = {
    profName: PropTypes.string.isRequired,
    courses: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    userReview: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      rating: 0,
      ratingError: false,
      review: '',
      reviewError: false,
      course: '',
      difficulty: '',
      isMandatory: '',
      textbookUsed: '',
      grades: ['A+', 'A' ,'B', 'C', 'D', 'E', 'F'],
      grade: '',
      visible: props.userReview == null,
    };
  }

  componentDidMount() {
    if (this.props.userReview != null) this.updateForm(this.props.userReview);
  }

  componentWillReceiveProps(nextProps) {
    if (!objectEquals(this.props.userReview, nextProps.userReview)) {
      this.updateForm(nextProps.userReview);
    }
  }

  updateForm = (userReview) => {
    if (userReview == null) {
      return this.setState({
        rating: 0,
        review: '',
        course: '',
        difficulty: '',
        isMandatory: '',
        textbookUsed: '',
        grade: '',
      });
    }

    const {
      subject,
      catalogNumber,
      rating,
      difficulty,
      isMandatory,
      textbookUsed,
      grade,
      comments,
    } = userReview;

    let course = '';

    for (let i = 0; i < this.props.courses.length; i++) {
      const c = this.props.courses[i];
      if (subject === c.subject && catalogNumber === c.catalogNumber) {
        course = i;
        break;
      }
    }
    this.setState({
      rating: rating || 0,
      review: comments || '',
      course,
      difficulty: difficulty || '',
      isMandatory: (isMandatory == null) ? '' : (isMandatory) ? 'yes' : 'no',
      textbookUsed: (textbookUsed == null) ? '' : (textbookUsed) ? 'yes' : 'no',
      grade: grade || '',
    });
  }

  openForm = () => this.setState({ visible: true });

  closeForm = () => this.setState({ visible: false });

  changeRating = (rating) => this.setState({ rating, ratingError: false });

  changeCourse = (ev) => this.setState({ course: ev.target.value });

  changeReview = (ev) => this.setState({ review: ev.target.value, reviewError: false });

  changeDifficulty = (ev) => this.setState({ difficulty: ev.target.value });

  changeMandatory = (ev) => this.setState({ isMandatory: ev.target.value });

  changeTextbook = (ev) => this.setState({ textbookUsed: ev.target.value });

  changeGrade = (ev) => this.setState({ grade: ev.target.value });

  onSubmit = () => {
    const {
      rating,
      review,
      course,
      difficulty,
      isMandatory,
      textbookUsed,
      grade,
    } = this.state;
    const reviewError = (review.length === 0 || review.length > MAX_WORDS);
    const ratingError = (rating === 0);

    if (reviewError || ratingError) {
      this.setState({ reviewError, ratingError });
    } else {
      const reviewObj = {
        rating,
        comments: review,
        subject: (typeof course === 'number') ? this.props.courses[course].subject : null,
        catalogNumber: (typeof course === 'number') ? this.props.courses[course].catalogNumber : null,
        difficulty: difficulty || null,
        isMandatory: (isMandatory === '') ? null : (isMandatory === 'yes') ? true : false,
        textbookUsed: (textbookUsed === '') ? null : (textbookUsed === 'yes') ? true : false,
        grade: grade || null,
      };
      this.props.onSubmit(reviewObj);
      this.setState({ visible: false });
    }
  }

  onDelete = () => {
    this.props.onDelete();
    this.setState({ review: '', visible: true });
  }

  render() {
    const errorDiv = (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        { this.state.reviewError && (
          <span style={ styles.errorText }>{ `Review cannot exceed ${MAX_WORDS} words.` }</span>
        ) }
        { this.state.ratingError && (
          <span style={ styles.errorText }>{ `A rating is required.` }</span>
        ) }
      </div>
    );

    const form = (
      <form style={ styles.container } noValidate autoComplete="off">
        <div style={{ display: 'flex' }}>
          <FormControl style={ styles.courseField }>
            <InputLabel htmlFor="course">Course</InputLabel>
            <Select
              value={ this.state.course }
              onChange={ this.changeCourse }
              inputProps={{ id: 'course' }}
            >
              {
                this.props.courses.map(({ subject, catalogNumber }, i) => (
                  <MenuItem key={ i } value={ i }>{ `${subject} ${catalogNumber}` }</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <div style={{ height: 'fit-content', margin: 7, marginTop: 'auto' }}>
            <StarRatings
              rating={ this.state.rating }
              changeRating={ this.changeRating }
              isSelectable
              numOfStars={ 5 }
              { ...styles.stars }
            />
          </div>
        </div>
        <TextField
          label="Leave a review"
          placeholder={ `What are your thoughts on ${this.props.profName}?` }
          multiline
          value={ this.state.review }
          onChange={ this.changeReview }
          style={ styles.textField }
          error={ this.state.reviewError }
          margin="normal"
          variant="outlined"
        />
        <div style={{ display: 'flex', marginBottom: 25 }}>
          <div style={{ flex: 1, margin: 'auto 7px' }}>
            <ExpansionPanel style={ styles.expansionPanel }>
              <ExpansionPanelSummary
                expandIcon={ <ExpandMoreIcon /> }
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, .03)',
                  borderBottom: '1px solid rgba(0, 0, 0, .125)',
                }}
              >
                <Typography>Add More Details</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div style={ styles.expansionDetails }>
                  <FormControl style={ styles.difficulty }>
                    <FormLabel component="legend" align="left">How difficult was it?</FormLabel>
                    <Select
                      value={ this.state.difficulty }
                      onChange={ this.changeDifficulty }
                      style={{ width: 100 }}
                    >
                      <MenuItem value={ 1 }>1 (Easy)</MenuItem>
                      <MenuItem value={ 2 }>2</MenuItem>
                      <MenuItem value={ 3 }>3</MenuItem>
                      <MenuItem value={ 4 }>4</MenuItem>
                      <MenuItem value={ 5 }>5 (Hard)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl component="fieldset" style={ styles.mandatory }>
                    <FormLabel component="legend" align="left">Was attendance mandatory?</FormLabel>
                    <RadioGroup
                      value={ this.state.isMandatory }
                      onChange={ this.changeMandatory }
                      style={{ flexDirection: 'row' }}
                    >
                      <FormControlLabel value="yes" control={ <Radio /> } label="Yes" />
                      <FormControlLabel value="no" control={ <Radio /> } label="No" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component="fieldset" style={ styles.mandatory }>
                    <FormLabel component="legend" align="left">Was a textbook required?</FormLabel>
                    <RadioGroup
                      value={ this.state.textbookUsed }
                      onChange={ this.changeTextbook }
                      style={{ flexDirection: 'row' }}
                    >
                      <FormControlLabel value="yes" control={ <Radio /> } label="Yes" />
                      <FormControlLabel value="no" control={ <Radio /> } label="No" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component="fieldset" style={ styles.mandatory }>
                    <FormLabel component="legend" align="left">What was your grade?</FormLabel>
                    <Select
                      value={ this.state.grade }
                      onChange={ this.changeGrade }
                    >
                      {
                        this.state.grades.map(grade => (
                          <MenuItem key={ grade } value={ grade }>{ grade }</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div style={{ marginTop: 7, display: 'flex', flexDirection: 'column' }}>
            <div>
              {
                (this.props.userReview != null) && (
                  <Button
                    variant="contained"
                    size="medium"
                    style={ styles.deleteBtn }
                    onClick={ this.onDelete }
                  >
                    Delete
                  </Button>
                )
              }
              <Button
                variant="contained"
                size="medium"
                style={ styles.submitBtn }
                onClick={ this.onSubmit }
              >
                Submit
              </Button>
            </div>
            { errorDiv }
          </div>
        </div>
      </form>
    );

    // If not written review yet
    if (!this.props.userReview) return (
      <div>
        { form }
      </div>
    );

    return (
      <div>
        {
          (this.state.visible)
            ? (
              <Button
                variant="contained"
                size="medium"
                style={ styles.closeBtn }
                onClick={ this.closeForm }
              >
                Cancel
              </Button>
            )
            : (
              <Button
                variant="contained"
                size="medium"
                style={ styles.openBtn }
                onClick={ this.openForm }
              >
                Edit Review
              </Button>
            )
        }
        {
          this.state.visible && form
        }
      </div>
    );
  }

}
