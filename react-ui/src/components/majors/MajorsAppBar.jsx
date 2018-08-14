import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import OpenIcon from 'material-ui/svg-icons/action/open-in-new';
import { whiteGrey } from '../../constants/Colours';

const styles = {
  container: {
    background: 'white',
    position: 'relative',
    width: '100%',
    height: 75,
    zIndex: 1,
    boxShadow: '0 8px 6px -6px #999',
    display: 'flex',
  },
  leftContainer: {
    height: '100%',
    display: 'flex',
    flex: 1,
  },
  titleContainer: {
    margin: 'auto',
    marginLeft: 30,
  },
  title: {
    color: 'black',
    textAlign: 'left',
    marginRight: 10,
    fontSize: 25,
  },
  openIcon: {
    verticalAlign: 'sub',
    borderRadius: 24,
  },
  rightContainer: {
    marginRight: 50,
    marginTop: -4,
  },
  select: {
    width: 'fit-content',
    textAlign: 'left',
  },
};

const MajorsAppBar = ({
  majorName,
  majorKey,
  url,
  onChange,
  majorsList,
}) => (
  <div style={ styles.container }>
    <div style={ styles.leftContainer }>
      <div style={ styles.titleContainer }>
        <span style={ styles.title }>{ majorName }</span>
        <IconButton
          style={ styles.openIcon }
          href={ url }
          target="_blank"
          hoveredStyle={{ backgroundColor: whiteGrey }}
        >
          <OpenIcon />
        </IconButton>
      </div>
    </div>
    <div style={ styles.rightContainer }>
      <SelectField
        floatingLabelText="Choose a major"
        onChange={ onChange }
        style={ styles.select }
        value={ majorKey }
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
);

export default MajorsAppBar;
