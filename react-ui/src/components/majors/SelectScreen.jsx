import React from 'react';
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

const SelectScreen = ({ handleMajorChange, handleFacultyChange, majorsList, faculty, major }) => (
  <div style={styles.container}>
    <div style={styles.selectScreen}>
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <span style={styles.headerText}>Select a Major</span>
          <span style={styles.subtitle}>
            Select a major below to check out how far along you are to fulfill its requirements!
          </span>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ margin: 'auto', marginRight: 10 }}>
          <SelectField
            floatingLabelText="Select a faculty"
            onChange={handleFacultyChange}
            style={styles.select}
            value={faculty}
            autoWidth
          >
            {Object.keys(majorsList).map((faculty, index) => (
              <MenuItem key={index} value={faculty} primaryText={majorsList[faculty].name} />
            ))}
          </SelectField>
        </div>
        <div>
          <SelectField
            floatingLabelText="Choose a major"
            onChange={handleMajorChange}
            style={styles.select}
            value={major}
            autoWidth
            disabled={!faculty.length}
          >
            {faculty.length &&
              Object.keys(majorsList[faculty].majors).map((major, index) => (
                <MenuItem
                  key={index}
                  value={major}
                  primaryText={majorsList[faculty].majors[major]}
                />
              ))}
          </SelectField>
        </div>
      </div>
    </div>
  </div>
);

SelectScreen.propTypes = {
  handleMajorChange: PropTypes.func.isRequired,
  handleFacultyChange: PropTypes.func.isRequired,
  majorsList: PropTypes.object.isRequired,
  faculty: PropTypes.string.isRequired,
  major: PropTypes.string.isRequired,
};

export default SelectScreen;
