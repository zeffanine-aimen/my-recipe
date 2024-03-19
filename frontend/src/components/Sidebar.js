// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaStickyNote, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css'; // Import the CSS file for styling

function Sidebar({ currentUser }) {
  return (
    <div className="sidebar">
      {/* Current user profile */}
      <div className="current-user">
        {currentUser.avatarUrl ? (
          <img src={currentUser.avatarUrl} alt={currentUser.name} className="avatar" />
        ) : (
          <FaUserCircle className="avatar" />
        )}
        <span className="name">{currentUser.name}</span>
      </div>
      
      {/* Sidebar links */}
      <div className="sidebar-links">
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
        <Link to="/logout" className="link">
          <FaSignOutAlt className="icon" />
          <span className="link-text">Logout</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
