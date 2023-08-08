import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Define the setError state
  const handleLogout = async () => {
    // Perform logout logic
    try {
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Logout successful, you can perform further actions
          console.log('Logout successful');
          setIsLoggedIn(false);
          // Redirect to the Login route
          navigate('/');
        } else {
          const data = await response.json();
          setError(data.message || 'Logout failed');
        }
      } catch (error) {
        console.log(error);
        setError('An error occurred. Please try again.');
      }
  };

  return (
    <div>
      <h2>Logout Page</h2>
      <button className="button" onClick={handleLogout}>Logout</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Logout;
