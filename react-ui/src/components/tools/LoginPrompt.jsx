import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let active = false;
let toastId = null;

const LoginPrompt = ({ history, pathname, text }) => {
  function handleClick() {
    history.push('/login', { from: pathname });
    active = false;
  }

  return (
    <div>
      <span>
        { text }
        <FlatButton label="Log In" onClick={ handleClick } />
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
  toastId = toast.info(<LoginPrompt history={ history } pathname={ pathname } text={ text } />, {
    onClose: () => active = false,
  });
};
