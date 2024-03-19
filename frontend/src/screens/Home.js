import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Post from '../components/Post';
import LoginMessage from '../components/LoginMsg';
import '../styles/Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Initialize currentUser state

  const navigate = useNavigate();

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

    // Fetch user profile data if token is available
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/account/profile`, {
            headers: {
              Authorization: token
            }
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [token]); // Include token in dependency array

  const handlePostClick = (postId) => {
    if (token) {
      navigate(`/post/${postId}`);
    } else {
      setShowLoginMessage(true);
    }
  };

  return (
    <div className="home-container">
      {/* Pass currentUser to Sidebar component */}
      <Sidebar currentUser={currentUser ? currentUser : { name: 'Name' }} />
      <div className="recipes">
        <h2>Recipes</h2>
        {posts.length === 0 ? (
          <p className="no-posts-msg">No posts available at the moment. Please check back later.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id} onClick={() => handlePostClick(post.id)}>
                <Post post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {showLoginMessage && <LoginMessage />}
    </div>
  );
}

export default Home;
