import React from 'react';
import { RiUserFill } from 'react-icons/ri';
import moment from 'moment';
import '../styles/Post.css'; // Import CSS file for styling

function Post({ post }) {
  const firstImage = post.Post_Images.length > 0 ? post.Post_Images[0] : null;
  const updatedAt = moment(post.updatedAt);

  return (
    <div className="post-card">
      {firstImage && (
        <div className="post-image-container">
          <img src={`${process.env.REACT_APP_API_URL}${firstImage.img_uri}`} alt={firstImage.alt} className="post-image" />
        </div>
      )}
      <div className="user-info">
        {post.User.img_uri ? (
          <img src={`${process.env.REACT_APP_API_URL}${post.User.img_uri}`} alt="User Avatar" className="user-avatar" />
        ) : (
          <div className="user-avatar"><RiUserFill size="2em" /></div>
        )}
        <div className="user-details">
          <p className="user-name">{post.User.name}</p>
          <p className="time">{updatedAt.fromNow()}</p>
        </div>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.contents}</p>
    </div>
  );
}

export default Post;
