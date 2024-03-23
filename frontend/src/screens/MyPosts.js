import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }

        const config = {
          headers: {
            Authorization: token,
          },
        };

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/my-posts`, config);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }

      const config = {
        headers: {
          Authorization: token,
        },
      };

      await axios.delete(`${process.env.REACT_APP_API_URL}/my-posts/delete`, { data: { postId } }, config);
      // After successful deletion, remove the deleted post from the state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h1>My Posts</h1>
      {posts.length === 0 ? (
        <p>No posts to display.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.contents}</p>
              <div>
                {post.Post_Images.map(image => (
                  <img key={image.id} src={`${process.env.REACT_APP_API_URL}${image.img_uri}`} alt="Post" />
                ))}
              </div>
              <Link to={`/update-post/${post.id}`}>Update Post</Link>
              <button onClick={() => handleDeletePost(post.id)}>Delete Post</button> {/* Button to delete the post */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPosts;
