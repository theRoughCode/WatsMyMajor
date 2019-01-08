import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AddIcon from 'material-ui/svg-icons/content/add';
import CourseCard from './CourseCard';
import Parser from './ParseCourses';
import SearchBar from '../SearchBar';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DragTypes } from 'constants/DragTypes';
import {
  purple,
  lightPurple,
  lightGreen
} from 'constants/Colours';

const space = 8;
const stylesConst = {
  height: 'auto',
  width: 200,
};
const styles = {
  board: {
    margin: 10,
    width:  stylesConst.width,
    display: 'flex',
    flexDirection: 'column',
  },
  header: (isDragging) => ({
    padding: '5px 0',
    backgroundColor: isDragging ? lightPurple : purple,
    color: 'white',
    fontSize: 18,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    display: 'flex',
  }),
  box: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardTitle: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  level: {
    fontSize: 14,
    marginTop: 3,
  },
  editIcon: {
    color: 'white',
    marginLeft: 'auto'
  },
  listContainer: {
    height: 'calc(100% - 70px)',
    margin: '6px 0',
  },
  addCourseCard: {
    border: '1px dashed #bcbcbc',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    height: 'auto',
  },
  addIcon: {
    width: 40,
    height: 40,
    cursor: 'pointer',
  }
};

const getListStyle = (isDraggingOver) => ({
  padding: space,
  width: stylesConst.width - space * 2,
  maxHeight: '100%',
  height: stylesConst.height,
  background: isDraggingOver ? lightGreen : 'inherit',
});

const AddCourseCard = ({ onClick }) => (
  <FlatButton style={ styles.addCourseCard } onClick={ onClick } >
    <div style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
      <AddIcon style={ styles.addIcon } />
    </div>
  </FlatButton>
);

AddCourseCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const renderCourses = (showAdd, courseList, onClick, highlightBackground) => {
  const courses = courseList.map((course, index) => {
    const key = `${course.subject}/${course.catalogNumber}/${index}`;
    return (
      <Draggable
        key={ key }
        draggableId={ key }
        index={ index }
        type={ DragTypes.COURSE }
      >
        { (provided, snapshot) => (
          <CourseCard
            course={ course }
            provided={ provided }
            snapshot={ snapshot }
            highlightBackground={ highlightBackground }
          />
        ) }
      </Draggable>
    );
  });
  // Add "Add courses" button if not a cart
  if (showAdd) courses.push(<AddCourseCard key='add-course' onClick={ onClick } />);
  return courses;
};

export default class TermBoard extends Component {

  static propTypes = {
    index: PropTypes.string,
    term: PropTypes.string,
    level: PropTypes.string,
    courses: PropTypes.array,
    provided: PropTypes.object,
    snapshot: PropTypes.object,
    isCart: PropTypes.bool,
    onRenameBoard: PropTypes.func,
    onUpdateCourses: PropTypes.func,
    onDeleteBoard: PropTypes.func,
    onClearBoard: PropTypes.func.isRequired,
  };

  static defaultProps = {
    index: '',
    term: '',
    level: '',
    courses: [],
    provided: {},
    snapshot: {},
    isCart: false,
    onUpdateCourses: () => null,
    onRenameBoard: () => null,
  };

  state = {
    renameDialogOpen: false,
    importDialogOpen: false,
    addDialogOpen: false,
    settingsOpen: false,
    relevel: '1A',
    rename: this.props.term,
    renameError: '',
    importText: ''
  };

  toggleSettings = (open) => this.setState({ settingsOpen: open });

  openRenameDialog = () => this.setState({ settingsOpen: false, renameDialogOpen: true });
  openImportDialog = () => this.setState({ settingsOpen: false, importDialogOpen: true });
  openAddDialog = () => this.setState({ settingsOpen: false, addDialogOpen: true });

  closeRenameDialog = () => this.setState({ rename: this.props.term, renameError: '', renameDialogOpen: false });
  closeImportDialog = () => this.setState({ importDialogOpen: false });
  closeAddDialog = () => this.setState({ addDialogOpen: false });

  onChangeRenameText = (e, rename) => this.setState({ rename, renameError: '' });
  onChangeRelevel = (ev, index, relevel) => this.setState({ relevel });
  onChangeImportText = (importText) => this.setState({ importText });

  onRename = () => {
    const { rename, relevel } = this.state;
    if (rename.length === 0) {
      this.setState({ renameError: 'Field cannot be left blank' });
      return;
    }
    this.props.onRenameBoard(rename, relevel);
    this.closeRenameDialog();
  }

  onImport = () => {
    const { importText } = this.state;
    this.closeImportDialog();

    fetch('/server/parse/courses', {
      method: 'POST',
      body: JSON.stringify({ text: importText }),
      headers: {
        'content-type': 'application/json',
        'x-secret': process.env.REACT_APP_SERVER_SECRET
      }
    }).then(response => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      else return response.json();
    }).then((termCourses) => {
      this.setState({ importing: false });
      const { courses } = termCourses;
      this.props.onUpdateCourses(courses);
    }).catch(err => toast.error(`Failed to parse your courses. Error: ${err.message}`));
  }

  onSearchResult = (subject, catalogNumber) => {
    this.props.onUpdateCourses([{ subject, catalogNumber }])
    this.closeAddDialog();
  }

  clearBoard = () => {
    this.props.onClearBoard();
    this.toggleSettings(false);
  }

  deleteBoard = () => {
    this.props.onDeleteBoard();
    this.toggleSettings(false);
  }

  render() {
    const { index, term, level, courses, isCart } = this.props;
    const droppableId = (isCart) ? 'Cart' : index;

    const renameDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.closeRenameDialog }
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={ this.onRename }
      />,
    ];

    const importDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.closeImportDialog }
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={ this.onImport }
      />,
    ];

    const addDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.closeAddDialog }
      />,
    ];

    let innerRef = null;
    let draggableProps = [];
    let dragHandleProps = [];
    let isDragging = false;
    if (this.props.provided.hasOwnProperty('innerRef')) {
      innerRef = this.props.provided.innerRef;
      draggableProps = this.props.provided.draggableProps;
      dragHandleProps = this.props.provided.dragHandleProps;
    }
    if (this.props.snapshot.hasOwnProperty('isDragging')) {
      isDragging = this.props.snapshot.isDragging;
    }

    return (
      <div ref={ innerRef } { ...draggableProps }>
        <Paper
          zDepth={ 1 }
          style={ styles.board }
        >
          <div style={ styles.header(isDragging) } { ...dragHandleProps }>
            <div style={ styles.box } />
            <div style={{ ...styles.box, ...styles.boardTitle }}>
              <span>{ term }</span>
              { (level.length > 0) && (
                <span style={ styles.level }>{ level }</span>
              ) }
            </div>
            <div style={ styles.box } >
              <IconMenu
                iconButtonElement={ <IconButton><MoreVertIcon /></IconButton> }
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                iconStyle={ styles.editIcon }
                onRequestChange={ this.toggleSettings }
                open={ this.state.settingsOpen }
                useLayerForClickAway
              >
                {
                  isCart
                    ? <MenuItem primaryText="Clear Cart" onClick={ this.clearBoard } />
                    : (
                      <div>
                        <MenuItem primaryText="Edit Name" onClick={ this.openRenameDialog } />
                        <MenuItem primaryText="Import Courses" onClick={ this.openImportDialog } />
                        <MenuItem primaryText="Clear Term" onClick={ this.clearBoard } />
                        <MenuItem primaryText="Delete Term" onClick={ this.deleteBoard } />
                      </div>
                    )
                }
              </IconMenu>
            </div>
          </div>
          <div style={ styles.listContainer }>
            <Droppable
              droppableId={ droppableId }
              type={ DragTypes.COURSE }
            >
              { (provided, snapshot) => (
                <div
                  ref={ provided.innerRef }
                  style={ getListStyle(snapshot.isDraggingOver) }
                >
                  { renderCourses(!isCart && !snapshot.isDraggingOver, courses, this.openAddDialog, snapshot.isDraggingOver) }
                  { provided.placeholder }
                </div>
              ) }
            </Droppable>
          </div>
          <Dialog
            title="Rename Board"
            actions={ renameDialogActions }
            modal={ false }
            open={ this.state.renameDialogOpen }
            onRequestClose={ this.closeRenameDialog }
            contentStyle={{ width: 400 }}
          >
            <TextField
              hintText="e.g. Winter 2019"
              floatingLabelText="New Board Name"
              value={ this.state.rename }
              errorText={ this.state.renameError }
              onChange={ this.onChangeRenameText }
            />
            <SelectField
              floatingLabelText="Term Level"
              value={ this.state.relevel }
              onChange={ this.onChangeRelevel }
            >
              <MenuItem value="1A" primaryText="1A" />
              <MenuItem value="1B" primaryText="1B" />
              <MenuItem value="2A" primaryText="2A" />
              <MenuItem value="2B" primaryText="2B" />
              <MenuItem value="3A" primaryText="3A" />
              <MenuItem value="3B" primaryText="3B" />
              <MenuItem value="4A" primaryText="4A" />
              <MenuItem value="4B" primaryText="4B" />
              <MenuItem value="5A+" primaryText="5A+" />
            </SelectField>
          </Dialog>
          <Dialog
            title="Import Courses"
            actions={ importDialogActions }
            modal={ false }
            open={ this.state.importDialogOpen }
            onRequestClose={ this.closeImportDialog }
            contentStyle={{ width: 900, maxWidth: 'none', height: 600 }}
          >
            <Parser onChange={ this.onChangeImportText } />
          </Dialog>
          <Dialog
            title="Add Course"
            actions={ addDialogActions }
            modal={ false }
            open={ this.state.addDialogOpen }
            onRequestClose={ this.closeAddDialog }
          >
            <SearchBar onResult={ this.onSearchResult } />
          </Dialog>
        </Paper>
      </div>
    );
  }
}
