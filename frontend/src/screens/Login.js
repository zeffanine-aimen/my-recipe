import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMsg from '../components/ErrorMsg';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

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

    setLoading(false); 
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
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'} {/* Change button text based on loading state */}
          </button>
        </form>
        <p>Don't have an account? <Link to="/register">Register here</Link>.</p>
      </div>
    </div>
  );
}

export default Login;
