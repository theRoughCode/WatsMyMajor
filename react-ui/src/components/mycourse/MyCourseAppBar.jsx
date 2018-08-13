import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

const styles = {
  container: {
    background: 'white',
    position: 'relative',
    width: '100%',
    height: 70,
    zIndex: 1,
    boxShadow: '0 8px 6px -6px #999',
    display: 'flex',
  },
  titleContainer: {
    height: '100%',
    display: 'flex',
    flex: 1,
  },
  title: {
    color: 'black',
    textAlign: 'left',
    margin: 'auto',
    marginLeft: 30,
    fontSize: 25,
  },
  buttonContainer: {
    marginTop: 5,
    marginRight: 10,
  },
  button: {
		margin: 10,
	},
};

export default class MyCourseAppBar extends Component {

  static propTypes = {
    onAddBoard: PropTypes.func.isRequired,
		onImport: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    showClearButton: PropTypes.bool.isRequired,
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
			console.log(err);
			alert(`Failed to parse your courses. Error: ${err.message}`);
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
        primary={ true }
        onClick={ this.closeAddTermDialog }
      />,
      <FlatButton
        label="Submit"
        primary={ true }
        onClick={ this.onAddTerm }
      />,
    ];
		const importDialogActions = [
      <FlatButton
        label="Cancel"
        primary={ true }
        onClick={ this.closeImportDialog }
      />,
      <FlatButton
        label="Submit"
        primary={ true }
        onClick={ this.onImport }
      />,
    ];
    const clearDialogActions = [
      <FlatButton
        label="Cancel"
        primary={ true }
        onClick={ this.closeClearDialog }
      />,
      <FlatButton
        label="Confirm"
        primary={ true }
        onClick={ this.onClear }
      />,
    ];

    return (
      <div style={ styles.container }>
        <div style={ styles.titleContainer }>
          <span style={ styles.title }>My Courses</span>
        </div>
        <div style={ styles.buttonContainer }>
          <RaisedButton
            onClick={ this.openAddTermDialog }
            label="Add Term"
            backgroundColor="#a4c639"
            style={ styles.button }
            icon={ <AddIcon /> }
          />
          <RaisedButton
            onClick={ this.openImportDialog }
            label="Import Courses"
            backgroundColor="#75caef"
            style={ styles.button }
            icon={ <ImportIcon /> }
          />
          {
            this.props.showClearButton && (
              <RaisedButton
                onClick={ this.openClearDialog }
                label="Clear Board"
                backgroundColor="#ff5454"
                style={ styles.button }
                icon={ <ClearIcon /> }
              />
            )
          }
          <Dialog
            title="Add Term"
            actions={ addTermDialogActions }
            modal={ false }
            open={ this.state.addTermDialogOpen }
            onRequestClose={ this.closeAddTermDialog }
            contentStyle={{  width: 400  }}
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
    );
  }

}
