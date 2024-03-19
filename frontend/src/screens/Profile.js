import React, { useState } from 'react';
import axios from 'axios';

function Profile({ currentUser }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/account/profile/update`, { name, password });
      // Optionally, update local state or show a success message
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleUploadPhoto = async () => {
    const formData = new FormData();
    formData.append('avatar', photo);

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/account/profile/upload-photo`, formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      // Optionally, update local state or show a success message
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div>
      {currentUser && (
        <div>
          <h2>Profile</h2>
          <p>Name: {currentUser.name}</p>
          {/* Display other user information */}
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleUpdateProfile}>Update Profile</button>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
          <button onClick={handleUploadPhoto}>Upload Photo</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
