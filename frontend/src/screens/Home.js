// Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import Post from '../components/Post';
import LoginMessage from '../components/LoginMsg'; // Import the LoginMessage component
import '../styles/Home.css'; // Import the CSS file for styling

function Home() {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showLoginMessage, setShowLoginMessage] = useState(false); // State to control visibility of login message
  const navigate = useNavigate(); // Get the navigate function for navigation

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Mock current user information
  const currentUser = {
    name: 'John Doe', // Replace with actual user information
    // avatarUrl: 'https://example.com/avatar.jpg', // Replace with actual avatar URL
  };

  // Function to handle post click
  const handlePostClick = (postId) => {
    // Check if user is logged in
    if (token) {
      // Navigate to post details page
      navigate(`/post/${postId}`);
    } else {
      // If user is not logged in, show login message
      setShowLoginMessage(true);
    }
  };

  return (
    <div className="home-container">
      {/* Render the Sidebar component with currentUser prop */}
      <Sidebar currentUser={currentUser} />
      <div className="recipes">
        <h2>Recipes</h2>
        <ul>
          {posts.map(post => (
            // Make each post clickable
            <li key={post.id} onClick={() => handlePostClick(post.id)}>
              <Post post={post} />
            </li>
          ))}
        </ul>
      </div>
      {/* Render the LoginMessage component if showLoginMessage is true */}
      {showLoginMessage && <LoginMessage />}
    </div>
  );
}

export default Home;
