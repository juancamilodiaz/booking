// src/Reservation.js
import React, { useEffect, useState } from 'react';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);

  // Fetch reservations data from the backend and set it to the reservations state
  useEffect(() => {
    // Fetch reservations data from the backend
    fetch('/reservations/Tennis')
      .then((response) => response.json())
      .then((data) => setReservations(data.reservations))
      .catch((error) => console.error('Error fetching reservations:', error));
  }, []);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeSlots = [];
  const startTime = 7; // 7 am
  const endTime = 21; // 9 pm

  for (let hour = startTime; hour <= endTime; hour++) {
    for (let minute = 0; minute < 60; minute += 60) {
      const time = new Date();
      time.setHours(hour, minute);

      timeSlots.push(time);
    }
  }

  return (
    <div>
      <h1>Reservation Page</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Today</th>
            <th>Tomorrow</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, index) => (
            <tr key={index}>
              <td>{timeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td>
                {reservations.map((reservation, index) => {
                  const reservationTime = new Date(reservation.reserved_at);

                  if (reservationTime.getDate() === today.getDate()) {
                    // Reservation is for today
                    if (reservationTime.getHours() === timeSlot.getHours() && reservationTime.getMinutes() === timeSlot.getMinutes()) {
                      return <td key={index}>Reserved by {reservation.reservedBy}</td>;
                    }
                  }

                  // Reservation is not for today's time slot
                  return <td key={index}></td>;
                })}
              </td>
              <td>
                {reservations.map((reservation, index) => {
                  const reservationTime = new Date(reservation.reserved_at);

                  if (reservationTime.getDate() === tomorrow.getDate()) {
                    // Reservation is for tomorrow
                    if (reservationTime.getHours() === timeSlot.getHours() && reservationTime.getMinutes() === timeSlot.getMinutes()) {
                      return <td key={index}>Reserved by {reservation.reservedBy}</td>;
                    }
                  }

                  // Reservation is not for tomorrow's time slot
                  return <td key={index}></td>;
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservation;
