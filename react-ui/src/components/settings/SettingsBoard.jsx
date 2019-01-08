import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Field from './Field';
import RaisedButton from 'material-ui/RaisedButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import { red } from 'constants/Colours';

const styles = {
  boardContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    marginTop: 50,
    width: '100%',
  },
  boardHeaderContainer: {
    marginBottom: 10
  },
  boardText: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 500,
    float: 'left',
  },
  buttonContainer: {
    fontSize: 15,
    float: 'right',
  },
  buttonIcon: {
    height: 20,
    verticalAlign: 'sub',
  },
  boardBody: {
    paddingBottom: 10,
  },
};


// Takes in an array of fields: [name: string, Icon: func]
// Note: name must be a field in the values object
export default class SettingsBoard extends Component {

  static propTypes = {
    boardName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired,
    onSaveSettings: PropTypes.func.isRequired,
    verifyFields: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      values: Object.assign({}, props.values),
      errors: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  handleChange(field, ev) {
    const values = this.state.values;
    values[field] = ev.target.value;
    this.setState({ values });
  }

  onEdit() {
    this.setState({ isEditing: true });
  }

  onSave() {
    const errors = this.props.verifyFields(this.state.values);
    for (let key in errors) {
      if (errors[key].length > 0) {
        this.setState({ errors });
        return;
      }
    }
    this.props.onSaveSettings(this.props.username, this.state.values);
    this.setState({ isEditing: false, errors: {} });
  }

  onCancel() {
    const values = {};
    this.props.fields.forEach(({ name }) => values[name] = this.props.values[name]);

    this.setState({
      isEditing: false,
      values,
      errors: {},
    });
  }

  render() {
    const buttons = (this.state.isEditing)
      ? (
        <div style={ styles.buttonContainer }>
          <RaisedButton
            label="Save"
            labelPosition="before"
            primary
            icon={ <SaveIcon style={ styles.buttonIcon } /> }
            onClick={ this.onSave }
            type="submit"
          />
          <RaisedButton
            label="Cancel"
            labelPosition="before"
            backgroundColor={ red }
            icon={ <CancelIcon style={ styles.buttonIcon } /> }
            style={{ marginLeft: 10 }}
            onClick={ this.onCancel }
          />
        </div>
      )
      : (
        <RaisedButton
          label="Edit"
          labelPosition="before"
          icon={ <EditIcon style={ styles.buttonIcon } /> }
          style={ styles.buttonContainer }
          onClick={ this.onEdit }
        />
      );

    return (
      <form style={ styles.boardContainer } onSubmit={ e => e.preventDefault() }>
        <div style={ styles.boardHeaderContainer }>
          <span style={ styles.boardText }>{ this.props.boardName }</span>
          { buttons }
        </div>
        <Paper style={ styles.boardBody }>
          {
            this.props.fields.map(({ name, label, type, Icon }, index) => (
              <Field
                key={ index }
                name={ name }
                label={ label }
                errorText={ this.state.errors[name] }
                type={ type }
                value={ this.state.values[name] }
                isEditing={ this.state.isEditing }
                onChange={ this.handleChange }
                Icon={ Icon }
              />
            ))
          }
        </Paper>
      </form>
    );
  }
}
