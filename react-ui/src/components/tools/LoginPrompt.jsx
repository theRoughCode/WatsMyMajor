import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { toast } from "react-toastify";
import ArrowIcon from 'material-ui/svg-icons/content/forward';
import "react-toastify/dist/ReactToastify.css";

let active = false;
let toastId = null;

const styles = {
  buttonStyle: {
    color: 'white',
  },
  iconStyle: {
    width: 18,
    height: 18,
  },
};

const LoginPrompt = ({ history, pathname, text }) => {
  function handleClick() {
    history.push('/login', { from: pathname });
    active = false;
  }

  return (
    <div>
      <span>
        { text }
        <FlatButton
          label="Log In"
          labelPosition="before"
          style={ styles.buttonStyle }
          onClick={ handleClick }
          hoverColor='#ea6d60'
          icon={ <ArrowIcon style={ styles.iconStyle } /> }
        />
      </span>
    </div>
  );
};

LoginPrompt.propTypes = {
  history: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  text: PropTypes.string,
};

LoginPrompt.defaultProps = {
  text: 'Please log in to access this feature!',
};

export const fireLoginPrompt = (history, pathname, text) => {
  if (active) {
    toast.update(toastId, {
      render: <LoginPrompt history={ history } pathname={ pathname } text={ text } />,
      autoClose: 5000
    });
    return;
  }
  active = true;
  toastId = toast.error(<LoginPrompt history={ history } pathname={ pathname } text={ text } />, {
    onClose: () => active = false,
  });
};
