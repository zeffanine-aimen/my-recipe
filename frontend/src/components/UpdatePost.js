import React, { useState } from 'react';
import axios from 'axios';

const UpdatePost = ({ postId }) => {
  const [updatedContent, setUpdatedContent] = useState('');

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle case where token is not available
        console.error('Token not found in localStorage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/my-posts/${postId}/update`,
        { content: updatedContent }, // Assuming you want to update the content
        config
      );
      console.log('Post updated:', response.data);
      // Optionally, you can handle successful update here (e.g., show a message)
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Post</button>
    </div>
  );
};

export default UpdatePost;
