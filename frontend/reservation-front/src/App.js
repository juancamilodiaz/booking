// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Reservation from './Reservation';

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/reservation">Reservation</Link>
          </li>
          {/* Add other navigation links here */}
        </ul>
      </nav>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/reservation" element={<Reservation />} />
        {/* Add other routes for different pages */}
      </Routes>
    </Router>
  );
};

export default App;
