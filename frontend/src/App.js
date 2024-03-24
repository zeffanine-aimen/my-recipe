// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Profile from './screens/Profile';
import CreatePost from './screens/CreatePost';
import PostDetails from './screens/PostDetails';
import MyPosts from './screens/MyPosts';
import NotFound from './screens/NotFound'; // Import your NotFound component

// Custom Route component for handling authentication
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  // If token exists, render the component, else redirect to login
  return token ? <Route {...rest} element={<Component />} /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/create-post" element={<ProtectedRoute element={CreatePost} />} />
        <Route path="/post/:postId" element={<ProtectedRoute element={PostDetails} />} />
        <Route path="/my-posts" element={<ProtectedRoute element={MyPosts} />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
