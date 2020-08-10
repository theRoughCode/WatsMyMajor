import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowIcon from 'material-ui/svg-icons/navigation/chevron-right';
import { purple } from 'constants/Colours';

const styles = {
  container: {
    margin: 10,
    marginTop: 20,
  },
  header: {
    display: 'flex',
    height: 48,
    backgroundColor: purple,
    color: 'white',
  },
  body: {
    minHeight: 50,
  },
  listItem: {
    textAlign: 'left',
  },
};

const Resources = ({ resources }) =>
  resources.length === 0 ? null : (
    <div style={{ margin: '0 auto' }}>
      <Paper style={styles.container}>
        <div style={styles.header}>
          <span style={{ margin: 'auto' }}>Useful Resources</span>
        </div>
        <div style={styles.body}>
          <List component="nav">
            {resources.map(({ title, link }, i) => {
              if (!link.startsWith('http')) link = 'http://' + link;
              return (
                <ListItem
                  key={i}
                  button
                  component="a"
                  rel="noopener noreferrer"
                  href={link}
                  target="_blank"
                >
                  <ListItemIcon style={{ marginRight: 5 }}>
                    <ArrowIcon />
                  </ListItemIcon>
                  <ListItemText primary={title} style={{ padding: 0 }} />
                </ListItem>
              );
            })}
          </List>
        </div>
      </Paper>
    </div>
  );

Resources.propTypes = {
  resources: PropTypes.array.isRequired,
};

export default Resources;
