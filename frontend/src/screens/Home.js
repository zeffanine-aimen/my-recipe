// Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  return (
    <div className="home-container">
      <div className="sidebar">Sidebar</div>
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
