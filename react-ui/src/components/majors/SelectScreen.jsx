import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '60%',
  },
  selectScreen: {
    margin: 'auto',
  },
  header: {
    display: 'flex',
    paddingLeft: 30,
  },
  titleContainer: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  headerText: {
    margin: 'auto',
    fontWeight: 500,
    fontSize: 40,
  },
  subtitle: {
    marginTop: 30,
    color: '#888e99',
    width: 570,
    fontSize: 20,
  },
  select: {
    margin: 'auto',
    marginTop: 30,
    textAlign: 'left',
  },
};


const SelectScreen = ({ handleChange, majorsList, value }) => (
  <div style={ styles.container }>
    <div style={ styles.selectScreen }>
      <div style={ styles.header }>
        <div style={ styles.titleContainer }>
          <span style={ styles.headerText }>Select a Major</span>
          <span style={ styles.subtitle }>
            Select a major below to check out how far along you are to fulfill its requirements!
          </span>
        </div>
      </div>
      <div>
        <SelectField
          floatingLabelText="Choose a major"
          onChange={ handleChange }
          style={ styles.select }
          value={ value }
          autoWidth
          >
          {
            majorsList.map(({ key, name }, index) => (
              <MenuItem key={ index } value={ key } primaryText={ name } />
            ))
          }
        </SelectField>
      </div>
    </div>
  </div>
);

SelectScreen.propTypes = {
  handleChange: PropTypes.func.isRequired,
  majorsList: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
};

export default SelectScreen;
