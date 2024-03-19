import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorMsg from '../components/ErrorMsg';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/account/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.error('Error:', error.message);
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <ErrorMsg message={error} />} 
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Email</label>
          </div>
          <div className="form-group">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>Password</label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
