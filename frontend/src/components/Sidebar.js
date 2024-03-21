import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaStickyNote, FaPlusCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/Sidebar.css'; // Import the CSS file for styling

function Sidebar({ currentUser, token }) {
  return (
    <div className="sidebar">
      {/* Current user profile */}
      {token && currentUser ? (
        <div className="current-user">
          <div className="avatar-container">
            {currentUser.img_uri ? (
              <img src={`${process.env.REACT_APP_API_URL}${currentUser.img_uri}`} alt={currentUser.name} className="avatar" />
            ) : (
              <FaUserCircle className="avatar" />
            )}
          </div>
          <span className="name">{currentUser.name}</span>
        </div>
      ) : (
        <div className="current-user">
          <FaUserCircle className="avatar" />
          <span className="name">Name</span>
        </div>
      )}
      
      {/* Sidebar links */}
      <div className="sidebar-links">
        {token ? (
          <>
            <Link to="/profile" className="link">
              <FaUserCircle className="icon" />
              <span className="link-text">Profile</span>
            </Link>
            <Link to="/my-posts" className="link">
              <FaStickyNote className="icon" />
              <span className="link-text">My Posts</span>
            </Link>
            <Link to="/create-post" className="link">
              <FaPlusCircle className="icon" />
              <span className="link-text">Create Post</span>
            </Link>
            <Link to="/logout" className="link" onClick={() => localStorage.removeItem('token')}>
              <FaSignOutAlt className="icon" />
              <span className="link-text">Logout</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="link">
              <FaSignInAlt className="icon" />
              <span className="link-text">Login</span>
            </Link>
            <Link to="/register" className="link">
              <FaUserPlus className="icon" />
              <span className="link-text">Register</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
