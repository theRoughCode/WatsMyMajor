import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { toast } from 'react-toastify';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui/svg-icons/content/add';
import ImportIcon from 'material-ui/svg-icons/action/backup';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import Parser from './ParseTranscript';
import Trash from './Trash';
import {
  skyBlue,
  red,
  lightGreen2,
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
    showClearButton: PropTypes.bool.isRequired,
    showTrashOnDrag: PropTypes.bool,
    isDraggingCourse: PropTypes.bool,
  };

  static defaultProps = {
    showTrashOnDrag: false,
    isDraggingCourse: false,
  };

  state = {
    addTermDialogOpen: false,
    importDialogOpen: false,
    clearDialogOpen: false,
    text: '',
    level: '1A',
    errorText: '',
  };

  openAddTermDialog = () => this.setState({ addTermDialogOpen: true });
  openImportDialog = () => this.setState({ importDialogOpen: true });
  openClearDialog = () => this.setState({ clearDialogOpen: true });

  closeAddTermDialog = () => this.setState({ text: '', errorText: '', addTermDialogOpen: false });
  closeImportDialog = () => this.setState({ text: '', importDialogOpen: false });
  closeClearDialog = () => this.setState({ clearDialogOpen: false });

  onChangeText = (_, text) => this.setState({ text, errorText: '' });
  onChangeLevel = (ev, index, level) => this.setState({ level });

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

  render() {
    const addTermDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.closeAddTermDialog }
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={ this.onAddTerm }
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
    const clearDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={ this.closeClearDialog }
      />,
      <FlatButton
        label="Confirm"
        primary
        onClick={ this.onClear }
      />,
    ];

    const showTrash = (this.props.showTrashOnDrag && this.props.isDraggingCourse);

    return (
      <div style={ styles.container }>
        { this.props.showTrashOnDrag && (
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
                    <RaisedButton
                      onClick={ this.openAddTermDialog }
                      label="Add Term"
                      backgroundColor={ lightGreen2 }
                      style={ styles.button(matches) }
                      icon={ <AddIcon /> }
                    />
                    <RaisedButton
                      onClick={ this.openImportDialog }
                      label="Import Courses"
                      backgroundColor={ skyBlue }
                      style={ styles.button(matches) }
                      icon={ <ImportIcon /> }
                    />
                    {
                      this.props.showClearButton && (
                        <RaisedButton
                          onClick={ this.openClearDialog }
                          label="Clear Board"
                          backgroundColor={ red }
                          style={ styles.button(matches) }
                          icon={ <ClearIcon /> }
                        />
                      )
                    }
                  </div>
                ) }
              </MediaQuery>
            </MediaQuery>
            <MediaQuery maxWidth={ 821 }>
              <RaisedButton
                onClick={ this.openAddTermDialog }
                backgroundColor={ lightGreen2 }
                style={ styles.xsButton }
                icon={ <AddIcon /> }
              />
              <RaisedButton
                onClick={ this.openImportDialog }
                backgroundColor={ skyBlue }
                style={ styles.xsButton }
                icon={ <ImportIcon /> }
              />
              {
                this.props.showClearButton && (
                  <RaisedButton
                    onClick={ this.openClearDialog }
                    backgroundColor={ red }
                    style={ styles.xsButton }
                    icon={ <ClearIcon /> }
                  />
                )
              }
            </MediaQuery>
          </div>
          <div>
            <Dialog
              title="Add Term"
              actions={ addTermDialogActions }
              modal={ false }
              open={ this.state.addTermDialogOpen }
              onRequestClose={ this.closeAddTermDialog }
              contentStyle={{ width: 400 }}
            >
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
            </Dialog>
            <Dialog
              title="Import Courses"
              actions={ importDialogActions }
              modal={ false }
              open={ this.state.importDialogOpen }
              onRequestClose={ this.closeImportDialog }
              contentStyle={{ width: 1000, maxWidth: 'none', height: 600 }}
            >
              <Parser onChange={ text => this.onChangeText(null, text) } />
            </Dialog>
            <Dialog
              title="Clear Courses"
              actions={ clearDialogActions }
              modal={ false }
              open={ this.state.clearDialogOpen }
              onRequestClose={ this.closeClearDialog }
            >
              <span>Are you sure you want to clear your courses?</span>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

}
