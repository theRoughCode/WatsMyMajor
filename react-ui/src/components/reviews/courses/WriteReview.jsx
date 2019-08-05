import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from 'material-ui/Slider';
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
import { white, purple, yellow2, red, darkRed, green } from 'constants/Colours';

const styles = {
  container: {
    width: '100%',
    overflowX: 'hidden',
  },
  instructorField: {
    marginRight: 7,
    marginBottom: 7,
    minWidth: 90,
    maxWidth: 120,
  },
  selectField: {
    minWidth: 78,
    marginRight: 7,
    marginBottom: 7,
  },
  textField: {
    margin: '10px 7px',
    display: 'flex',
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
  sliderOuterDiv: {
    display: 'flex',
    maxWidth: 420,
  },
  sliderInnerDiv: { margin: 'auto' },
  sliderLabel: (num) => ({
    marginLeft: 5,
    marginRight: 15,
    backgroundColor: (num <= 2) ? darkRed : (num >= 4) ? green : yellow2,
    color: 'white',
    padding: '1.5px 6px',
    borderRadius: 5,
    display: 'inline'
  }),
  slider: {
    margin: '10px auto',
    float: 'right',
    maxWidth: 300,
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
    subject: PropTypes.string.isRequired,
    catalogNumber: PropTypes.string.isRequired,
    profs: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    userReview: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const years = [];
    const minYear = 2014;
    for (let i = new Date().getFullYear(); i >= minYear; i--) {
      years.push(i);
    }

    this.state = {
      open: false,
      year: '',
      years,
      yearError: false,
      term: '',
      terms: ['Fall', 'Winter', 'Spring'],
      termError: false,
      interesting: 3,
      useful: 3,
      easy: 3,
      ratingError: false,
      comments: '',
      advice: '',
      reviewError: false,
      prof: '',
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
        comments: '',
        term: '',
        year: '',
        interesting: 3,
        useful: 3,
        easy: 3,
        advice: '',
        prof: '',
        isMandatory: '',
        textbookUsed: '',
        grade: '',
      });
    }

    const {
      prof,
      isMandatory,
      textbookUsed,
      grade,
      comments,
      advice,
      term,
      year,
      interesting,
      useful,
      easy,
    } = userReview;

    const profIdx = this.props.profs.indexOf(prof);
    const termIdx = this.state.terms.indexOf(term);
    const yearIdx = this.state.years.indexOf(year);

    this.setState({
      comments: comments || '',
      advice: advice || '',
      prof: (profIdx > -1) ? profIdx : '',
      term: (termIdx > -1) ? termIdx : '',
      year: (yearIdx > -1) ? yearIdx : '',
      interesting: interesting || 3,
      useful: useful || 3,
      easy: easy || 3,
      isMandatory: (isMandatory == null) ? '' : (isMandatory) ? 'yes' : 'no',
      textbookUsed: (textbookUsed == null) ? '' : (textbookUsed) ? 'yes' : 'no',
      grade: grade || '',
    });
  }

  openForm = () => this.setState({ visible: true });

  closeForm = () => this.setState({ visible: false });

  changeEasy = (_, easy) => this.setState({ easy });
  changeUseful = (_, useful) => this.setState({ useful });
  changeInteresting = (_, interesting) => this.setState({ interesting });

  changeProf = (ev) => this.setState({ prof: ev.target.value });
  changeTerm = (ev) => this.setState({ term: ev.target.value, termError: false });
  changeYear = (ev) => this.setState({ year: ev.target.value, yearError: false });

  changeComments = (ev) => this.setState({ comments: ev.target.value, reviewError: false });
  changeAdvice = (ev) => this.setState({ advice: ev.target.value });

  changeMandatory = (ev) => this.setState({ isMandatory: ev.target.value });

  changeTextbook = (ev) => this.setState({ textbookUsed: ev.target.value });

  changeGrade = (ev) => this.setState({ grade: ev.target.value });

  onSubmit = () => {
    const {
      comments,
      advice,
      prof,
      term,
      year,
      years,
      terms,
      interesting,
      useful,
      easy,
      isMandatory,
      textbookUsed,
      grade,
    } = this.state;
    const reviewError = (comments.length === 0 || comments.length > MAX_WORDS);
    const termError = (term.length === 0);
    const yearError = (year.length === 0);

    if (reviewError || termError || yearError) {
      this.setState({ reviewError, termError, yearError });
    } else {
      const reviewObj = {
        comments,
        advice,
        term: terms[term],
        year: years[year],
        interesting,
        useful,
        easy,
        prof: (typeof prof === 'number') ? this.props.profs[prof] : null,
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
    this.setState({ comments: '', advice: '', visible: true });
  }

  render() {
    const errorDiv = (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        { this.state.reviewError && (
          <span style={ styles.errorText }>{ `Review cannot exceed ${MAX_WORDS} words.` }</span>
        ) }
        { this.state.yearError && (
          <span style={ styles.errorText }>{ `Please select a year.` }</span>
        ) }
        { this.state.termError && (
          <span style={ styles.errorText }>{ `Please select a term.` }</span>
        ) }
      </div>
    );

    const form = (
      <form style={ styles.container } noValidate autoComplete="off">
        <div style={{ display: 'flex' }}>
          <FormControl style={ styles.instructorField }>
            <InputLabel htmlFor="prof">Instructor</InputLabel>
            <Select
              value={ this.state.prof }
              onChange={ this.changeProf }
              inputProps={{ id: 'prof' }}
            >
              {
                this.props.profs.map((prof, i) => (
                  <MenuItem key={ i } value={ i }>{ prof }</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControl style={ styles.selectField }>
            <InputLabel htmlFor="term">Term</InputLabel>
            <Select
              value={ this.state.term }
              onChange={ this.changeTerm }
              inputProps={{ id: 'term' }}
            >
              {
                this.state.terms.map((term, i) => (
                  <MenuItem key={ i } value={ i }>{ term }</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControl style={ styles.selectField }>
            <InputLabel htmlFor="year">Year</InputLabel>
            <Select
              value={ this.state.year }
              onChange={ this.changeYear }
              inputProps={{ id: 'year' }}
            >
              {
                this.state.years.map((year, i) => (
                  <MenuItem key={ i } value={ i }>{ year }</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div style={ styles.sliderOuterDiv }>
          <div style={ styles.sliderInnerDiv }>
            <span>Easy:</span>
            <span style={ styles.sliderLabel(this.state.easy) }>{ this.state.easy }</span>
          </div>
          <div style={{ flex: 1 }}>
            <Slider
              step={ 1 }
              value={ this.state.easy }
              min={ 1 }
              max={ 5 }
              onChange={ this.changeEasy }
              sliderStyle={ styles.slider }
            />
          </div>
        </div>
        <div style={ styles.sliderOuterDiv }>
          <div style={ styles.sliderInnerDiv }>
            <span>Useful:</span>
            <span style={ styles.sliderLabel(this.state.useful) }>{ this.state.useful }</span>
          </div>
          <div style={{ flex: 1 }}>
            <Slider
              step={ 1 }
              value={ this.state.useful }
              min={ 1 }
              max={ 5 }
              onChange={ this.changeUseful }
              sliderStyle={ styles.slider }
            />
          </div>
        </div>
        <div style={ styles.sliderOuterDiv }>
          <div style={ styles.sliderInnerDiv }>
            <span>Interesting:</span>
            <span style={ styles.sliderLabel(this.state.interesting) }>{ this.state.interesting }</span>
          </div>
          <div style={{ flex: 1 }}>
            <Slider
              step={ 1 }
              value={ this.state.interesting }
              min={ 1 }
              max={ 5 }
              onChange={ this.changeInteresting }
              sliderStyle={ styles.slider }
            />
          </div>
        </div>
        <TextField
          label="Leave a review"
          placeholder={ `What are your thoughts on ${this.props.subject} ${this.props.catalogNumber}?` }
          multiline
          value={ this.state.comments }
          onChange={ this.changeComments }
          style={ styles.textField }
          error={ this.state.reviewError }
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Give some advice"
          placeholder={ 'Any advice for this course?' }
          multiline
          value={ this.state.advice }
          onChange={ this.changeAdvice }
          style={ styles.textField }
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
    if (!this.props.userReview) return form;

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
