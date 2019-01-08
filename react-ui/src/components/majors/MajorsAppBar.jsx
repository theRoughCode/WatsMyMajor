import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import OpenIcon from 'material-ui/svg-icons/action/open-in-new';
import { whiteGrey } from 'constants/Colours';

const styles = {
  container: {
    background: 'white',
    position: 'relative',
    width: '100%',
    height: 75,
    minHeight: 'fit-content',
    zIndex: 1,
    boxShadow: '0 8px 6px -6px #999',
    display: 'flex',
  },
  leftContainer: {
    height: 'fit-content',
    display: 'flex',
    margin: 'auto',
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
    marginTop: -4,
    display: 'flex',
  },
  selectContainer: {
    margin: 'auto',
    marginRight: 10,
  },
  select: {
    margin: 'auto',
    textAlign: 'left',
  },
};

const MajorsAppBar = ({
  majorName,
  majorKey,
  url,
  faculty,
  handleMajorChange,
  handleFacultyChange,
  majorsList,
}) => (
  <div style={ styles.container }>
    <div style={ styles.leftContainer }>
      <div style={ styles.titleContainer }>
        <span style={ styles.title }>{ majorName }</span>
        <IconButton
          style={ styles.openIcon }
          href={ url }
          target="_blank" rel="noopener noreferrer"
          hoveredStyle={{ backgroundColor: whiteGrey }}
        >
          <OpenIcon />
        </IconButton>
      </div>
    </div>
    <MediaQuery minWidth={ 935 }>
      <div style={ styles.rightContainer }>
        <div style={ styles.selectContainer }>
          <SelectField
            floatingLabelText="Select a faculty"
            onChange={ handleFacultyChange }
            style={ styles.select }
            value={ faculty }
            autoWidth
          >
            {
              Object.keys(majorsList).map((faculty, index) => (
                <MenuItem
                  key={ index }
                  value={ faculty }
                  primaryText={ majorsList[faculty].name }
                />
              ))
            }
          </SelectField>
        </div>
        <div style={ styles.selectContainer }>
          <SelectField
            floatingLabelText="Choose a major"
            onChange={ handleMajorChange }
            style={ styles.select }
            value={ majorKey }
            autoWidth
            disabled={ !faculty.length }
          >
            {
              faculty.length && Object.keys(majorsList[faculty].majors).map((major, index) => (
                <MenuItem
                  key={ index }
                  value={ major }
                  primaryText={ majorsList[faculty].majors[major] }
                />
              ))
            }
          </SelectField>
        </div>
      </div>
    </MediaQuery>
  </div>
);

MajorsAppBar.propTypes = {
  majorName: PropTypes.string.isRequired,
  majorKey: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  faculty: PropTypes.string.isRequired,
  handleFacultyChange: PropTypes.func.isRequired,
  handleMajorChange: PropTypes.func.isRequired,
  majorsList: PropTypes.object.isRequired,
};

export default MajorsAppBar;
