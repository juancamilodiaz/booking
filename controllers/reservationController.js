const { format, isToday, isTomorrow, isWithinInterval } = require('date-fns');
const { Reservation } = require('../models/reservationModel');

exports.getUserReservations = async (req, res) => {
  try {
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    // Fetch reservations for the user based on user ID
    const userReservations = await Reservation.findAll({ where: { user_id: user.id } });

    return res.status(200).json({ reservations: userReservations });
  } catch (error) {
    console.error('Error fetching user reservations', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createReservation = async (req, res) => {
    try {
      const { user } = req.session;
      if (!user) {
        return res.status(401).json({ error: 'User not logged in' });
      }
  
      const { scenario_name, sport_type, reserved_at } = req.body;
  
      // Convert the input date to Date object
      const reservationDate = new Date(reserved_at);
  
      // Check if reserved_at is within the allowed range (current day and the next day)
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      if (!isWithinInterval(reservationDate, { start: today, end: tomorrow })) {
        return res.status(400).json({ error: 'Reservation date must be within the current day and the next day' });
      }
  
      // Check if reserved_at is between 7 am and 9 pm
      const reservedHour = reservationDate.getHours();
      if (reservedHour < 7 || reservedHour >= 21) {
        return res.status(400).json({ error: 'Reservation time must be between 7 am and 9 pm' });
      }
  
      // Check if the facility and sport type are available for the desired time slot
      const existingReservation = await Reservation.findOne({
        where: {
          scenario_name,
          sport_type,
          reserved_at: {
            $gte: format(reservationDate, 'yyyy-MM-dd HH:mm:ss'),
            $lt: format(new Date(reservationDate.getTime() + 60 * 60 * 1000), 'yyyy-MM-dd HH:mm:ss'), // Add 1 hour to reserved_at
          },
        },
      });
  
      if (existingReservation) {
        return res.status(409).json({ error: 'Facility and sport type are already reserved for the desired time slot' });
      }
  
      // Create the reservation
      const reservation = await Reservation.create({
        user_id: user.id,
        scenario_name,
        sport_type,
        reserved_at: reservationDate,
        duration_minutes: 60,
      });
  
      return res.status(201).json({ message: 'Reservation created successfully', reservation });
    } catch (error) {
      console.error('Error creating reservation', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.deleteReservation = async (req, res) => {
try {
    const { user } = req.session;
    if (!user) {
    return res.status(401).json({ error: 'User not logged in' });
    }

    const { reserved_at } = req.params;

    // Find and delete the reservation based on reserved_at and user_id
    const deletedReservation = await Reservation.destroy({
    where: {
        user_id: user.id,
        reserved_at: new Date(reserved_at),
    },
    });

    if (deletedReservation === 0) {
    return res.status(404).json({ error: 'Reservation not found' });
    }

    return res.status(200).json({ message: 'Reservation deleted successfully' });
} catch (error) {
    console.error('Error deleting reservation', error);
    return res.status(500).json({ error: 'Internal server error' });
}
};