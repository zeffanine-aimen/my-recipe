import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
          const { countryName, principalSubdivision } = response.data;
          setCountry(countryName);
          setRegion(principalSubdivision);
        } catch (error) {
          console.error('Error fetching user location:', error);
        }
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const rawContentState = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      const formData = new FormData();
      formData.append('title', title);
      formData.append('contents', contents);
      formData.append('country', country);
      formData.append('region', region);
      formData.append('steps', rawContentState); // Sending steps as JSON string
      
      postImages.forEach((image) => {
        formData.append('postImg', image);
      });
  
      await axios.post(`${process.env.REACT_APP_API_URL}/posts/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token')
        }
      });
      console.log('Post created successfully');
      navigate('/');
      // Clear input fields after successful submission
      setTitle('');
      setContents('');
      setCountry('');
      setRegion('');
      setPostImages([]);
      setEditorState(EditorState.createEmpty());
    } catch (error) {
      console.error('Error creating post:', error.response ? error.response.data.errors : error.message);
      setErrors(error.response ? error.response.data.errors : [{ msg: error.message }]);
  
      setTimeout(() => {
        setErrors([]);
      }, 3000);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPostImages(prevImages => [...prevImages, ...files]);
  };

  // Redirect if there is no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="container">
      <h2>Create a New Post</h2>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index}>{error.msg}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="contents">Contents:</label>
          <textarea id="contents" value={contents} onChange={(e) => setContents(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input id="country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="region">Region:</label>
          <input id="region" type="text" value={region} onChange={(e) => setRegion(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="steps">Steps:</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
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
        </div>
        <div className="form-group">
          <label htmlFor="upload">Upload Images (Up to 5):</label>
          <input id="upload" type="file" accept="image/*" multiple onChange={handleImageChange} />
        </div>
        <div className="image-preview">
          {postImages.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt={`Image ${index}`} className="preview-image" />
          ))}
        </div>
        <button className="button" type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
