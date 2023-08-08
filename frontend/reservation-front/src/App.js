// src/App.js
import React, { useState }from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Navigation from './Navigation';
import Logout from './Logout';
import Reservation from './Reservation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} />
      <Routes>
        <Route exact path="/" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/reservation" element={<Reservation />} />
        {/* Add other routes for different pages */}
      </Routes>
    </Router>
  );
};

export default App;
