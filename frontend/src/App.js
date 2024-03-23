// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Profile from './screens/Profile';
import CreatePost from './screens/CreatePost';
import PostDetails from './screens/PostDetails';
import MyPosts from './screens/MyPosts';
import UpdatePost from './screens/UpdatePost'; // Import the UpdatePost component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:postId" element={<PostDetails />} /> 
        <Route path="/my-posts" element={<MyPosts />} /> 
        <Route path="/update-post/:postId" element={<UpdatePost />} /> {/* New route for UpdatePost */}
      </Routes>
    </Router>
  );
}

export default App;
