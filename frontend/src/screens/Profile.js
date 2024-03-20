import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

import '../styles/Profile.css'; // Import your CSS file for styling

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);


  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    setName(userData.name || '');
    setPassword(userData.password || '');
  }, [userData]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/account/profile`, {
        headers: {
          Authorization: token
        }
      });
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/account/profile/update`,
          { name, password },
          {
            headers: {
              Authorization: token
            }
          }
        );
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUploadAvatar = async () => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/account/profile/upload-photo`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-details">
      <div className="avatar-section">
        {avatar ? (
          <img src={URL.createObjectURL(avatar)} alt="Selected Avatar" className="selected-avatar" onClick={() => inputRef.current.click()} />
        ) : userData.img_uri ? (
          <img src={`${process.env.REACT_APP_API_URL}${userData.img_uri}`} alt={userData.name} className="avatar" onClick={() => inputRef.current.click()} />
        ) : (
          <FaUserCircle className="avatar" onClick={() => inputRef.current.click()} />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} ref={inputRef} style={{ display: 'none' }} />
        <button onClick={handleUploadAvatar}>Upload Avatar</button>
      </div>

        <div className="profile-form">
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              {nameError && <span className="error">{nameError}</span>}
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {passwordError && <span className="error">{passwordError}</span>}
            </div>
            <button type="submit" className="update-button">Update Profile</button>
          </form>
        </div>
      </div>
      {message && <p className="profile-message">{message}</p>}
    </div>
  );
};

export default Profile;
