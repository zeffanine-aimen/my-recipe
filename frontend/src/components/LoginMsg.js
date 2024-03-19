// LoginMessage.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginMsg.css';

const LoginMessage = () => {
  return (
    <div className="login-message-container">
      <div className="login-message">
        <p>You need to be logged in to view this post. Please <Link to="/login">login</Link>.</p>
      </div>
    </div>
  );
};

export default LoginMessage;
