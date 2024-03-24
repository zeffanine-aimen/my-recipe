// NotFound.js
import React from 'react';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Not Found</h1>
      <p style={styles.paragraph}>The page you're looking for does not exist.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  heading: {
    fontSize: '36px',
    color: '#333',
  },
  paragraph: {
    fontSize: '18px',
    color: '#555',
  },
};

export default NotFound;
