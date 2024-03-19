import React from 'react';


const ErrorMsg = ({ message }) => {
  return (
    <div className="error-container">
      <p className="error-message">{message}</p>
    </div>
  );
}

export default ErrorMsg;
