import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Field from './Field';
import RaisedButton from 'material-ui/RaisedButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';

const styles = {
  boardContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
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
  },
};


// Takes in an array of fields: [name: string, Icon: func]
// Note: name must be a field in the values object
export default class SettingsBoard extends Component {

  static propTypes = {
    username: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired,
    onEditSettings: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      values: Object.assign({}, props.values),
    };

    this.onEdit = this.onEdit.bind(this);
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
    this.props.onEditSettings(this.props.username, this.state.values);
    this.setState({ isEditing: false });
  }

  onCancel() {
    const values = {};
    this.props.fields.forEach(({ name }) => values[name] = this.props.values[name]);

    this.setState({
      isEditing: false,
      values,
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
              onClick={ this.onSave.bind(this, 'profile') }
            />
            <RaisedButton
              label="Cancel"
              labelPosition="before"
              backgroundColor="#e84a4a"
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
      <div style={ styles.boardContainer }>
        <div style={ styles.boardHeaderContainer }>
          <span style={ styles.boardText }>Profile</span>
          { buttons }
        </div>
        <Paper style={ styles.boardBody }>
          {
            this.props.fields.map(({ name, Icon }, index) => (
              <Field
                key={ index }
                name={ name }
                value={ this.state.values[name] }
                isEditing={ this.state.isEditing }
                onChange={ this.handleChange.bind(this, name) }
                Icon={ Icon }
              />
            ))
          }
        </Paper>
      </div>
    );
  }
}
