// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Profile from './screens/Profile';
import CreatePost from './screens/CreatePost';
import PostDetails from './screens/PostDetails';
import MyPosts from './screens/MyPosts';
import NotFound from './screens/NotFound';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/profile"  element={<Profile />} /> 
        <Route path="/create-post"  element={<CreatePost />} /> 
        <Route path="/post/:postId"  element={<PostDetails />} /> 
        <Route path="/my-posts"  element={<MyPosts />} /> 

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
