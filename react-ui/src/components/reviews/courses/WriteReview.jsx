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
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from 'material-ui/svg-icons/content/add';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
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
    minWidth: 95,
    maxWidth: 120,
  },
  selectField: {
    minWidth: 78,
    marginRight: 7,
    marginBottom: 7,
  },
  textField: {
    margin: '10px 0px',
    display: 'flex',
    backgroundColor: 'white',
  },
  deleteBtn: {
    backgroundColor: red,
    color: white,
    marginRight: 7,
    marginBottom: 7,
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
    marginBottom: 7,
  },
  sliderOuterDiv: {
    display: 'flex',
    maxWidth: 420,
  },
  sliderInnerDiv: { margin: 'auto' },
  sliderLabel: (num) => ({
    marginLeft: 5,
    marginRight: 15,
    backgroundColor: num <= 2 ? darkRed : num >= 4 ? green : yellow2,
    color: 'white',
    padding: '1.5px 6px',
    borderRadius: 5,
    display: 'inline',
  }),
  slider: {
    margin: '10px auto',
    float: 'right',
    maxWidth: 300,
  },
  card: {
    maxWidth: 500,
    margin: '10px 0px',
    border: '1px solid rgba(0, 0, 0, .2)',
    boxShadow: 'none',
  },
  cardHeader: {
    padding: '10px 20px',
    textAlign: 'left',
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
  },
  resourceDiv: {
    marginBottom: 10,
    display: 'flex',
  },
  resourceTitle: {
    maxWidth: 180,
    margin: 'auto 0',
  },
  resourceLink: {
    width: 260,
    margin: 'auto 5px',
  },
  expansionPanel: {
    maxWidth: 300,
    border: '1px solid rgba(0, 0, 0, .2)',
    boxShadow: 'none',
  },
  expansionHeader: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
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
    marginTop: 5,
  },
};

const MAX_WORDS = 500;
const MAX_RESOURCE_TITLE = 50;
const MAX_RESOURCE_LINK = 100;

const validURL = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return str.length === 0 || !!pattern.test(str);
};

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
      reviewError: '',
      prof: '',
      isMandatory: '',
      textbookUsed: '',
      grades: ['A+', 'A', 'B', 'C', 'D', 'E', 'F'],
      grade: '',
      resources: [{ title: '', link: '' }],
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
        resources: [{ title: '', link: '' }],
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
      resources,
    } = userReview;

    const profIdx = this.props.profs.indexOf(prof);
    const termIdx = this.state.terms.indexOf(term);
    const yearIdx = this.state.years.indexOf(year);

    this.setState({
      comments: comments || '',
      advice: advice || '',
      prof: profIdx > -1 ? profIdx : '',
      term: termIdx > -1 ? termIdx : '',
      year: yearIdx > -1 ? yearIdx : '',
      interesting: interesting || 3,
      useful: useful || 3,
      easy: easy || 3,
      isMandatory: isMandatory == null ? '' : isMandatory ? 'yes' : 'no',
      textbookUsed: textbookUsed == null ? '' : textbookUsed ? 'yes' : 'no',
      grade: grade || '',
      resources: resources || [{ title: '', link: '' }],
    });
  };

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

  changeResourceTitle = (i) => (ev) => {
    const resources = this.state.resources;
    resources[i].title = ev.target.value;
  };
  changeResourceLink = (i) => (ev) => {
    const resources = this.state.resources;
    resources[i].link = ev.target.value;
  };
  addResource = () => {
    const resources = this.state.resources.slice(0);
    resources.push({ title: '', link: '' });
    this.setState({ resources });
  };
  removeResource = (i) => () => {
    const resources = this.state.resources.slice(0);
    if (resources.length === 1) resources[0] = { title: '', link: '' };
    else resources.splice(i, 1);
    this.setState({ resources });
  };

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
    let reviewError = '';
    const numWords = comments.trim().replace(/\n/g, ' ').split(' ').length;
    if (numWords === 0) reviewError = 'Review cannot be left blank.';
    else if (numWords > MAX_WORDS) reviewError = `Review cannot exceed ${MAX_WORDS} words.`;
    const termError = term.length === 0;
    const yearError = year.length === 0;
    let resourcesError = false;
    const resources = this.state.resources.slice(0);
    for (let i = 0; i < resources.length; i++) {
      const { title, link } = resources[i];

      // Title error check
      if (title.length > MAX_RESOURCE_TITLE) {
        resourcesError = true;
        resources[i].titleErr = `Title cannot exceed ${MAX_RESOURCE_TITLE} chars.`;
      } else if (title.length === 0 && link.length > 0) {
        resourcesError = true;
        resources[i].titleErr = `Title cannot be blank.`;
      } else resources[i].titleErr = null;

      // Link error check
      if (link.length > MAX_RESOURCE_LINK) {
        resourcesError = true;
        resources[i].linkErr = `Link cannot exceed ${MAX_RESOURCE_LINK} chars.`;
      } else if (!validURL(link)) {
        resourcesError = true;
        resources[i].linkErr = 'Invalid link.';
      } else if (link.length === 0 && title.length > 0) {
        resourcesError = true;
        resources[i].linkErr = `Link cannot be blank.`;
      } else resources[i].linkErr = null;
    }

    if (reviewError.length > 0 || termError || yearError || resourcesError) {
      this.setState({ reviewError, termError, yearError, resources });
    } else {
      this.setState({ resources });
      const reviewObj = {
        comments: comments.trim(),
        advice,
        term: terms[term],
        year: years[year],
        interesting,
        useful,
        easy,
        prof: typeof prof === 'number' ? this.props.profs[prof] : null,
        isMandatory: isMandatory === '' ? null : isMandatory === 'yes',
        textbookUsed: textbookUsed === '' ? null : textbookUsed === 'yes',
        grade: grade || null,
        resources: resources.filter(({ title }) => title.length > 0),
      };
      this.props.onSubmit(reviewObj);
      this.setState({ visible: false });
    }
  };

  onDelete = () => {
    this.props.onDelete();
    this.setState({ comments: '', advice: '', visible: true });
  };

  render() {
    const errorDiv = (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {this.state.reviewError.length > 0 && (
          <span style={styles.errorText}>{this.state.reviewError}</span>
        )}
        {this.state.yearError && <span style={styles.errorText}>{`Please select a year.`}</span>}
        {this.state.termError && <span style={styles.errorText}>{`Please select a term.`}</span>}
      </div>
    );

    const resourcesList = this.state.resources.map(({ title, link, titleErr, linkErr }, i) => (
      <div key={`${i}:${title}${link}`} style={styles.resourceDiv}>
        <div style={styles.resourceTitle}>
          <TextField
            label="Title"
            placeholder="Describe this link"
            defaultValue={title}
            onChange={this.changeResourceTitle(i)}
            style={{ width: '100%', marginBottom: 0 }}
            error={titleErr != null}
            margin="normal"
            variant="outlined"
          />
          <div style={{ height: 10 }}>
            <span style={styles.errorText}>{titleErr}</span>
          </div>
        </div>
        <div style={styles.resourceLink}>
          <TextField
            label="Link"
            placeholder="Enter the link here..."
            defaultValue={link}
            onChange={this.changeResourceLink(i)}
            style={{ width: '100%', marginBottom: 0 }}
            error={linkErr != null}
            margin="normal"
            variant="outlined"
          />
          <div style={{ height: 10 }}>
            <span style={styles.errorText}>{linkErr}</span>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ margin: 'auto' }}>
            <IconButton style={{ padding: 5 }} onClick={this.removeResource(i)}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </div>
    ));

    const form = (
      <form style={styles.container} noValidate autoComplete="off">
        <div style={{ display: 'flex' }}>
          <FormControl style={styles.instructorField}>
            <InputLabel htmlFor="prof">Instructor</InputLabel>
            <Select value={this.state.prof} onChange={this.changeProf} inputProps={{ id: 'prof' }}>
              {this.props.profs.map((prof, i) => (
                <MenuItem key={i} value={i}>
                  {prof}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={styles.selectField}>
            <InputLabel htmlFor="term">Term</InputLabel>
            <Select value={this.state.term} onChange={this.changeTerm} inputProps={{ id: 'term' }}>
              {this.state.terms.map((term, i) => (
                <MenuItem key={i} value={i}>
                  {term}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={styles.selectField}>
            <InputLabel htmlFor="year">Year</InputLabel>
            <Select value={this.state.year} onChange={this.changeYear} inputProps={{ id: 'year' }}>
              {this.state.years.map((year, i) => (
                <MenuItem key={i} value={i}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={styles.sliderOuterDiv}>
          <div style={styles.sliderInnerDiv}>
            <span>Easy:</span>
            <span style={styles.sliderLabel(this.state.easy)}>{this.state.easy}</span>
          </div>
          <div style={{ flex: 1 }}>
            <Slider
              step={1}
              value={this.state.easy}
              min={1}
              max={5}
              onChange={this.changeEasy}
              sliderStyle={styles.slider}
            />
          </div>
        </div>
        <div style={styles.sliderOuterDiv}>
          <div style={styles.sliderInnerDiv}>
            <span>Useful:</span>
            <span style={styles.sliderLabel(this.state.useful)}>{this.state.useful}</span>
          </div>
          <div style={{ flex: 1 }}>
            <Slider
              step={1}
              value={this.state.useful}
              min={1}
              max={5}
              onChange={this.changeUseful}
              sliderStyle={styles.slider}
            />
          </div>
        </div>
        <div style={styles.sliderOuterDiv}>
          <div style={styles.sliderInnerDiv}>
            <span>Interesting:</span>
            <span style={styles.sliderLabel(this.state.interesting)}>{this.state.interesting}</span>
          </div>
          <div style={{ flex: 1 }}>
            <Slider
              step={1}
              value={this.state.interesting}
              min={1}
              max={5}
              onChange={this.changeInteresting}
              sliderStyle={styles.slider}
            />
          </div>
        </div>
        <TextField
          label="Leave a review"
          placeholder={`What are your thoughts on ${this.props.subject} ${this.props.catalogNumber}?`}
          multiline
          value={this.state.comments}
          onChange={this.changeComments}
          style={styles.textField}
          error={this.state.reviewError.length > 0}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Give some advice (optional)"
          placeholder={'Any advice for this course?'}
          multiline
          value={this.state.advice}
          onChange={this.changeAdvice}
          style={styles.textField}
          margin="normal"
          variant="outlined"
        />
        <Card style={styles.card}>
          <CardHeader
            action={
              <IconButton onClick={this.addResource}>
                <AddIcon />
              </IconButton>
            }
            title="Add useful resources"
            titleTypographyProps={{ style: { fontSize: '0.95rem' } }}
            style={styles.cardHeader}
          />
          <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>{resourcesList}</CardContent>
        </Card>
        <div style={{ display: 'flex', marginBottom: 25 }}>
          <div style={{ flex: 1, marginRight: 10 }}>
            <ExpansionPanel style={styles.expansionPanel}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={styles.expansionHeader}
              >
                <Typography>Add More Details</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div style={styles.expansionDetails}>
                  <FormControl component="fieldset" style={styles.mandatory}>
                    <FormLabel component="legend" align="left">
                      Was attendance mandatory?
                    </FormLabel>
                    <RadioGroup
                      value={this.state.isMandatory}
                      onChange={this.changeMandatory}
                      style={{ flexDirection: 'row' }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component="fieldset" style={styles.mandatory}>
                    <FormLabel component="legend" align="left">
                      Was a textbook required?
                    </FormLabel>
                    <RadioGroup
                      value={this.state.textbookUsed}
                      onChange={this.changeTextbook}
                      style={{ flexDirection: 'row' }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component="fieldset" style={styles.mandatory}>
                    <FormLabel component="legend" align="left">
                      What was your grade?
                    </FormLabel>
                    <Select value={this.state.grade} onChange={this.changeGrade}>
                      {this.state.grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div style={{ marginTop: 7, display: 'flex', flexDirection: 'column' }}>
            <div>
              {this.props.userReview != null && (
                <Button
                  variant="contained"
                  size="medium"
                  style={styles.deleteBtn}
                  onClick={this.onDelete}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="contained"
                size="medium"
                style={styles.submitBtn}
                onClick={this.onSubmit}
              >
                Submit
              </Button>
            </div>
            {errorDiv}
          </div>
        </div>
      </form>
    );

    // If not written review yet
    if (!this.props.userReview) return form;

    return (
      <div>
        {this.state.visible ? (
          <Button
            variant="contained"
            size="medium"
            style={styles.closeBtn}
            onClick={this.closeForm}
          >
            Cancel
          </Button>
        ) : (
          <Button variant="contained" size="medium" style={styles.openBtn} onClick={this.openForm}>
            Edit Review
          </Button>
        )}
        {this.state.visible && form}
      </div>
    );
  }
}
