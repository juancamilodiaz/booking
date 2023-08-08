// src/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Define the setError state
  const navigate = useNavigate();
  const [loggedIn] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Perform login logic here using 'email' and 'password' state
    console.log(`Logging in with email: ${email}, password: ${password}`);

    const loginData = { email, password };
    console.log(loginData);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Login successful, you can perform further actions
        console.log('Login successful');
        setIsLoggedIn(true);
        // Redirect to the Reservation route
        navigate('/reservation');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <button className="button" type="submit">Login</button>
        </div>
      </form>
      <div>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      {loggedIn}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
