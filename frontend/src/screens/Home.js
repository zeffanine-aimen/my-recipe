// Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import Post from '../components/Post';
import '../styles/Home.css'; // Import the CSS file for styling

function Home() {
  const [posts, setPosts] = useState([]);

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

  return (
    <div className="home-container">
      {/* Render the Sidebar component with currentUser prop */}
      <Sidebar currentUser={currentUser} />
      <div className="recipes">
        <h2>Recipes</h2>
        <ul>
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
