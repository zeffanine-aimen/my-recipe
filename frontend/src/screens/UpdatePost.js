import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePost = () => {
  const [post, setPost] = useState({});
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [steps, setSteps] = useState('');

  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
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

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/my-posts/${postId}`, config);
        setPost(response.data);
        setTitle(response.data.title);
        setContents(response.data.contents);
        setSteps(response.data.steps);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdatePost = async () => {
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

      await axios.put(`${process.env.REACT_APP_API_URL}/my-posts/${postId}/update`, {
        title,
        contents,
        steps
      }, config);
      // Redirect or show success message after successful update
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div>
      <h1>Update Post</h1>
      <label>Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Contents</label>
      <textarea value={contents} onChange={(e) => setContents(e.target.value)} />
      <label>Steps</label>
      <input type="text" value={steps} onChange={(e) => setSteps(e.target.value)} />
      <button onClick={handleUpdatePost}>Update Post</button>
    </div>
  );
};

export default UpdatePost;
