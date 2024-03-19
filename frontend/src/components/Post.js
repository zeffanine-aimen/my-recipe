// Post.js

import React from 'react';

function Post({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.contents}</p>
      <p>User: {post.User.name}</p>
      {post.Post_Images.map(image => (
        <img key={image.id} src={image.url} alt={image.alt} />
      ))}
      {/* Render other post details as needed */}
    </div>
  );
}

export default Post;
