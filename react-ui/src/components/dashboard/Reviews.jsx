import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import Divider from '@material-ui/core/Divider';

const styles = {
  container: {
    maxWidth: 360,
    margin: 'auto 10px',
  },
  innerContainer: {
    margin: 'auto',
    paddingTop: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 500,
  },
};

const getProfNames = async (list) => {
  try {
    const response = await fetch(`/server/prof/names`, {
      method: 'POST',
      body: JSON.stringify(list),
      headers: {
        'content-type': 'application/json',
        'x-secret': process.env.REACT_APP_SERVER_SECRET
      }
    });

    if (!response.ok) return { names: null };
    return await response.json();
  } catch (err) {
    console.error(err);
    return { subject: null, catalogNumber: null };
  }
}



export default class Reviews extends Component {

  static propTypes = {
    courses: PropTypes.array,
    profs: PropTypes.array,
  };

  static defaultProps = {
    courses: [],
    profs: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      profs: [],
      courses: [],
    };
  }

  async componentDidMount() {
    let { courses, profs } = this.props;
    profs = await getProfNames(profs);
    this.setState({ courses: courses || [], profs: profs || [] });
  }

  render() {
    const { profs } = this.state;
    return (
      <div style={ styles.container }>
        <Paper style={ styles.innerContainer }>
          <span style={ styles.header }>My Reviews</span>
          <List>
            { profs.map(({ name, id }) => (
              <ListItem key={ id } button component="a" href={ `/professors/${id}` }>
                <ListItemText primary={ name } />
              </ListItem>
            )) }
          </List>
        </Paper>
      </div>
    );
  }

}
