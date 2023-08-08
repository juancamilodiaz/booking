import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ isLoggedIn }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          {isLoggedIn ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
