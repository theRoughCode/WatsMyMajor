import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { toast } from 'react-toastify';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';
import ImportIcon from 'material-ui/svg-icons/action/backup';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import ClearIcon from 'material-ui/svg-icons/navigation/refresh';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Parser from './ParseTranscript';
import Trash from './Trash';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DeviceOrientation, { Orientation } from 'react-screen-orientation'

import {
  skyBlue,
  red,
  lightGreen2,
  blueGreenHighlight,
  mustard,
} from 'constants/Colours';

const styles = {
  container: {
    background: 'white',
    position: 'relative',
    width: '100%',
    height: 70,
    zIndex: 1,
    boxShadow: '0 8px 6px -6px #999',
  },
  responsiveDialog: {
    width: 'fit-content',
  },
  trashContainer: (isShowing) => ({
    display: (isShowing) ? 'flex' : 'none',
    height: '100%',
  }),
  innerContainer: (isHiding) => ({
    width: '100%',
    height: '100%',
    display: (isHiding) ? 'none' : 'flex',
  }),
  titleContainer: {
    height: '100%',
    display: 'flex',
    flex: 1,
  },
  title: (isBig) => ({
    color: 'black',
    textAlign: 'left',
    margin: 'auto',
    marginLeft: 30,
    fontSize: (isBig) ? 25 : 20,
  }),
  buttonContainer: {
    margin: 'auto',
    marginRight: 10,
  },
  button: (isBig) => ({
    margin: (isBig) ? 10 : 5,
  }),
  xsButton: {
    margin: 5,
    minWidth: 50,
  },
};

export default class MyCourseAppBar extends Component {

  static propTypes = {
    onAddBoard: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    showClearButton: PropTypes.bool.isRequired,
    showTrashOnDrag: PropTypes.bool,
    isDraggingCourse: PropTypes.bool,
    isEditing: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    showTrashOnDrag: false,
    isDraggingCourse: false,
  };

  state = {
    addTermDialogOpen: false,
    importDialogOpen: false,
    clearDialogOpen: false,
    rotationDialogOpen: false,
    text: '',
    level: '1A',
    errorText: '',
    menuEl: null,
  };

  openAddTermDialog = () => this.setState({ addTermDialogOpen: true });
  openImportDialog = () => this.setState({ importDialogOpen: true });
  openClearDialog = () => this.setState({ clearDialogOpen: true });
  openRotationDialog = () => this.setState({ rotationDialogOpen: true });

  closeAddTermDialog = () => this.setState({ text: '', errorText: '', addTermDialogOpen: false });
  closeImportDialog = () => this.setState({ text: '', importDialogOpen: false });
  closeClearDialog = () => this.setState({ clearDialogOpen: false });
  closeRotationDialog = () => this.setState({ rotationDialogOpen: false });

  onChangeText = (_, text) => this.setState({ text, errorText: '' });
  onChangeLevel = (ev, index, level) => this.setState({ level });

  openMenu = (ev) => this.setState({ menuEl: ev.currentTarget });
  closeMenu = (ev) => this.setState({ menuEl: null });

  onAddTerm = () => {
    const { text, level } = this.state;
    if (text.length === 0) {
      this.setState({ errorText: 'Field cannot be left blank' });
      return;
    }
    this.props.onAddBoard(text, level);
    this.closeAddTermDialog();
  }

  onImport = () => {
    const { text } = this.state;

    fetch('/server/parse/transcript', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {
        'content-type': 'application/json',
        'x-secret': process.env.REACT_APP_SERVER_SECRET
      }
    }).then(response => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      else return response.json();
    }).then((terms) => {
      this.setState({ importing: false });
      this.props.onImport(terms);
      this.closeImportDialog();
    }).catch(err => {
      this.closeImportDialog();
      console.error(err);
      toast.error(`Failed to parse your courses. Error: ${err.message}`);
    });
  }

  onClear = () => {
    this.closeClearDialog();
    this.props.onClear();
  }

  onEditOn = () => this.props.onEditChange(true);
  onEditOff = () => this.props.onEditChange(false);
  onCancel = () => this.props.onEditChange(false, true);

  render() {
    const {
      showTrashOnDrag,
      isDraggingCourse,
      showClearButton,
      isEditing,
    } = this.props;

    const showTrash = (showTrashOnDrag && isDraggingCourse);

    return (
      <div style={ styles.container }>
        { showTrashOnDrag && (
          <div style={ styles.trashContainer(showTrash) }>
            <Trash isMobile />
          </div>
        ) }
        <div style={ styles.innerContainer(showTrash) }>
          <div style={ styles.titleContainer }>
            <MediaQuery minWidth={ 552 }>
              { matches => (
                <span style={ styles.title(matches) }>My Courses</span>
              ) }
            </MediaQuery>
          </div>
          <div style={ styles.buttonContainer }>
            <MediaQuery minWidth={ 821 }>
              <MediaQuery minWidth={ 852 }>
                { matches => (
                  <div>
                    {
                      isEditing && (
                        <RaisedButton
                          onClick={ this.openAddTermDialog }
                          label="Add Term"
                          backgroundColor={ lightGreen2 }
                          style={ styles.button(matches) }
                          icon={ <AddIcon /> }
                        />
                      )
                    }
                    <RaisedButton
                      onClick={ this.openImportDialog }
                      label="Import Courses"
                      backgroundColor={ skyBlue }
                      style={ styles.button(matches) }
                      icon={ <ImportIcon /> }
                    />
                    {
                      isEditing && showClearButton && (
                        <RaisedButton
                          onClick={ this.openClearDialog }
                          label="Clear Board"
                          backgroundColor={ mustard }
                          style={ styles.button(matches) }
                          icon={ <ClearIcon /> }
                        />
                      )
                    }
                    {
                      isEditing
                        ? (
                          <RaisedButton
                            onClick={ this.onEditOff }
                            label="Save"
                            backgroundColor={ blueGreenHighlight }
                            style={ styles.button(matches) }
                            icon={ <SaveIcon /> }
                          />
                        )
                        : (
                          <RaisedButton
                            onClick={ this.onEditOn }
                            label="Edit Board"
                            backgroundColor={ lightGreen2 }
                            style={ styles.button(matches) }
                            icon={ <EditIcon /> }
                          />
                        )
                    }
                    {
                      isEditing && (
                        <RaisedButton
                          onClick={ this.onCancel }
                          label="Cancel"
                          backgroundColor={ red }
                          style={ styles.button(matches) }
                          icon={ <CloseIcon /> }
                        />
                      )
                    }
                  </div>
                ) }
              </MediaQuery>
            </MediaQuery>
            <MediaQuery maxWidth={ 821 }>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={ this.openMenu }
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={ this.state.menuEl }
                keepMounted
                open={ this.state.menuEl != null }
                onClose={ this.closeMenu }
              >
                {
                  isEditing && (
                    <MenuItem onClick={ this.openAddTermDialog }>
                      Add Term
                    </MenuItem>
                  )
                }
                {/* If screen of device is 'sm' and in portrait mode, then Dialog Import Courses wont open, 
                it will open in landscape mode for more comfort. 
                Using module screen-orientation.
                */}
                  <DeviceOrientation lockOrientation={'landscape'}>
                   {/* Will only be in DOM in landscape */}  
                  <Orientation orientation='landscape' alwaysRender={false} >
                      <MenuItem onClick={ this.openImportDialog }>
                        Import Courses
                      </MenuItem>
                    </Orientation>
                    {/* Will stay in DOM, but is only visible in portrait */}
                    <Orientation orientation='portrait' alwaysRender={false} >
                      <MenuItem onClick={ this.openRotationDialog  }>
                        Import Courses
                      </MenuItem>
                    </Orientation>
                  </DeviceOrientation>
                {
                  isEditing && showClearButton && (
                    <MenuItem onClick={ this.openClearDialog }>
                      Clear Board
                    </MenuItem>
                  )
                }
                {
                  isEditing
                    ? (
                      <MenuItem onClick={ this.onEditOff }>
                        Save Changes
                      </MenuItem>
                    )
                    : (
                      <MenuItem onClick={ this.onEditOn }>
                        Edit Board
                      </MenuItem>
                    )
                }
                {
                  isEditing && (
                    <MenuItem onClick={ this.onCancel }>
                      Discard Changes
                    </MenuItem>
                  )
                }
              </Menu>
            </MediaQuery>
          </div>
          <div>
            <Dialog
              modal={ false }
              open={ this.state.addTermDialogOpen }
              onRequestClose={ this.closeAddTermDialog }
              contentStyle={ styles.responsiveDialog }
            >
              <DialogTitle id="responsive-dialog-title">{"Add Term"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                <TextField
                  hintText="e.g. Fall 2018"
                  floatingLabelText="New Board Name"
                  errorText={ this.state.errorText }
                  onChange={ this.onChangeText }
                />
                <SelectField
                  floatingLabelText="Term Level"
                  value={ this.state.level }
                  onChange={ this.onChangeLevel }
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
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <FlatButton
                  label="Cancel"
                  primary
                  onClick={ this.closeAddTermDialog }
                />
                <FlatButton
                  label="Submit"
                  primary
                  onClick={ this.onAddTerm }
                />
                </DialogActions>
            </Dialog>

            {/* Dialog for portrait mode active, to rotate device */}
            <Dialog
              modal={ false }
              open={ this.state.rotationDialogOpen }
              onRequestClose={ this.closeRotationDialog }
              contentStyle={ styles.responsiveDialog }
              >
                <DialogTitle id="responsive-dialog-title">{"Import Courses"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please rotate your dispaly
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <FlatButton
                      label="Cancel"
                      primary
                      onClick={ this.closeRotationDialog }
                    />
                  </DialogActions>
              </Dialog>

              <Dialog
                modal={ false }
                open={ this.state.importDialogOpen }
                onRequestClose={ this.closeImportDialog }
                fullScreen = {true}
              >
                <DialogTitle id="responsive-dialog-title">{"Import Courses"}</DialogTitle>
                  <DialogContent>
                    <Parser onChange={ text => this.onChangeText(null, text) } />
                  </DialogContent>
                  <DialogActions>
                    <FlatButton
                      label="Cancel"
                      primary
                      onClick={ this.closeImportDialog }
                    />
                    <FlatButton
                      label="Submit"
                      primary
                      onClick={ this.onImport }
                    />
                  </DialogActions>
              </Dialog>

            <Dialog
              modal={ false }
              open={ this.state.clearDialogOpen }
              onRequestClose={ this.closeClearDialog }
              contentStyle={ styles.responsiveDialog }
            >
              <DialogTitle id="responsive-dialog-title">{"Clear Courses"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <span>Are you sure you want to clear your courses?</span>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <FlatButton
                  label="Cancel"
                  primary
                  onClick={ this.closeClearDialog }
                />
                <FlatButton
                  label="Confirm"
                  primary
                  onClick={ this.onClear }
                />
                </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

}


