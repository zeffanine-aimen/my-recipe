import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/MyPosts.css'


const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleDelete = async (postId) => {
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

      await axios.delete(`${process.env.REACT_APP_API_URL}/my-posts/delete`, {
        ...config,
        data: { postId }
      });

      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      // Validation checks for updateData fields
      if (!updateData.title || !updateData.contents || !updateData.steps) {
        console.error('Title, contents, or steps cannot be empty');
        return;
      }

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

      await axios.put(`${process.env.REACT_APP_API_URL}/my-posts/${updateData.id}/update`, {
        ...updateData,
        steps: JSON.stringify(convertToRaw(updateData.steps.getCurrentContent())),
      }, config);
      setShowUpdateForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleEditorChange = (editorState) => {
    setUpdateData({ ...updateData, steps: editorState });
    setEditorState(editorState);
  };

  const handleUpdateClick = (post) => {
    let stepsData;
    try {
      stepsData = typeof post.steps === 'string' ? JSON.parse(post.steps) : post.steps;
      if (!stepsData || !stepsData.blocks || !Array.isArray(stepsData.blocks)) {
        throw new Error('Invalid steps data format');
      }
    } catch (error) {
      console.error('Error parsing steps data:', error);
      // Set a default empty steps data if parsing fails
      stepsData = { blocks: [], entityMap: {} };
    }

    setUpdateData({ ...post, steps: EditorState.createWithContent(convertFromRaw(stepsData)) });
    setEditorState(EditorState.createWithContent(convertFromRaw(stepsData)));
    setShowUpdateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="my-posts">
      <h1 className="title">My Posts</h1>
      {showUpdateForm && (
        <div className="update-form">
          <h2 className="update-title">Update Post</h2>
          <input className="input" type="text" name="title" value={updateData.title} onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })} placeholder="Title" />
          <textarea className="textarea" name="contents" value={updateData.contents} onChange={(e) => setUpdateData({ ...updateData, contents: e.target.value })} placeholder="Content" />
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            toolbar={{
              options: ['blockType', 'list'],
              blockType: {
                inDropdown: false,
                options: ['OrderedlistItem', 'UnorderedlistItem'],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
              },
              list: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['ordered', 'unordered'],
                title: 'List',
              },
            }}
          />
          <button className="button update-button" onClick={handleUpdate}>Update</button>
        </div>
      )}
      {posts.length === 0 ? (
        <p className="no-posts">No posts to display.</p>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <div className="post-card" key={post.id}>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.contents}</p>
              <div className="image-container">
                {post.Post_Images.map((image, index) => (
                  <img key={index} src={`${process.env.REACT_APP_API_URL}${image.img_uri}`} alt={`Image ${index}`} className="post-image" />
                ))}
              </div>
              <div className="steps-container">
                <h3 className="steps-title">Steps:</h3>
                <ul className="steps-list">
                  {post.steps && typeof post.steps === 'string' ? JSON.parse(post.steps).blocks.map((step, index) => (
                    <li key={index} className="step-item">{step.text}</li>
                  )) : null}
                </ul>
              </div>
              <button className="button update-button" onClick={() => handleUpdateClick(post)}>Update</button>
              <button className="button delete-button" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;