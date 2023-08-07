// src/MakeReservation.js
import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const sportOptions = [
  { value: 'soccer', label: 'Soccer' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'basketball', label: 'Basketball' },
];

const MakeReservation = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSportChange = (selectedOption) => {
    setSelectedSport(selectedOption);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMakeReservation = () => {
    // Send reservation data to backend using axios
    const reservationData = {
      sport: selectedSport.value,
      date: selectedDate.toISOString(),
    };

    // Replace 'YOUR_BACKEND_API_URL' with the actual backend API endpoint
    axios.post('YOUR_BACKEND_API_URL', reservationData)
      .then((response) => {
        // Handle successful reservation
        console.log(response.data);
      })
      .catch((error) => {
        // Handle reservation error
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Make Reservation</h2>
      <Select options={sportOptions} value={selectedSport} onChange={handleSportChange} />
      <DatePicker selected={selectedDate} onChange={handleDateChange} showTimeSelect />
      <button onClick={handleMakeReservation}>Make Reservation</button>
    </div>
  );
};

export default MakeReservation;
