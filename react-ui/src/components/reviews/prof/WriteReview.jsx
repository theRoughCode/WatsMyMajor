import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import EditIcon from 'material-ui/svg-icons/image/edit';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { white, purple } from 'constants/Colours';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ ref } { ...props } />;
});

export default class WriteReview extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <Fab
          variant="extended"
          color="primary"
          aria-label="Rate"
          style={{ margin: 20, backgroundColor: purple }}
          onClick={ this.handleClickOpen }
        >
          <EditIcon style={{ marginRight: 5 }} color={ white } />
          Add A Review
        </Fab>
        <Dialog
          fullScreen
          open={ this.state.open }
          onClose={ this.handleClose }
          TransitionComponent={ Transition }
        >
          <AppBar style={{ backgroundColor: purple, position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                onClick={ this.handleClose }
                aria-label="Close"
                style={{ marginRight: 5 }}
              >
                <CloseIcon color={ white } />
              </IconButton>
              <Typography variant="h6" style={{ flex: 1, color: white }}>
                Rate A Professor
              </Typography>
              <Button color="inherit" onClick={ this.handleClose }>
                Submit
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemText primary="Phone ringtone" secondary="Titania" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Default notification ringtone" secondary="Tethys" />
            </ListItem>
          </List>
        </Dialog>
      </div>
    );
  }

}
