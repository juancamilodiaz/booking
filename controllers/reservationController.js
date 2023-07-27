const { format, isToday, isTomorrow, isWithinInterval, parseISO } = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');
const { Reservation } = require('../models/reservationModel');
const { Op } = require('sequelize');

exports.getUserReservations = async (req, res) => {
  try {
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    today.setHours(6, 59, 59, 999);

    // Fetch reservations for the user based on user ID
    const reservations = await Reservation.findAll({ 
      where: { 
        user_id: user.id,
        reserved_at: {
          [Op.between]: [today, tomorrow],
        },
      } 
    });

    const userReservations = reservations.map((reservation) => {
        // Convertir fechas UTC a la zona horaria específica para mostrar al cliente
        const start_time_local = utcToZonedTime(reservation.start_time, 'America/Bogota');
        const end_time_local = utcToZonedTime(reservation.end_time, 'America/Bogota');
        const reserved_at_local = utcToZonedTime(reservation.reserved_at, 'America/Bogota');
  
        return {
          id: reservation.id,
          scenario_name: reservation.scenario_name,
          sport_type: reservation.sport_type,
          start_time: format(start_time_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
          end_time: format(end_time_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
          reserved_at: format(reserved_at_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
        };
      });
  
      // Enviar las reservas del usuario al cliente
      return res.status(200).json({ userReservations });
  } catch (error) {
    console.error('Error fetching user reservations', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    today.setHours(6, 59, 59, 999);

    // Fetch reservations for the user based on user ID
    const reservations = await Reservation.findAll({ 
      where: {
        reserved_at: {
          [Op.between]: [today, tomorrow],
        },
      },
    });

    const userReservations = reservations.map((reservation) => {
        // Convertir fechas UTC a la zona horaria específica para mostrar al cliente
        const start_time_local = utcToZonedTime(reservation.start_time, 'America/Bogota');
        const end_time_local = utcToZonedTime(reservation.end_time, 'America/Bogota');
        const reserved_at_local = utcToZonedTime(reservation.reserved_at, 'America/Bogota');
  
        return {
          id: reservation.id,
          scenario_name: reservation.scenario_name,
          sport_type: reservation.sport_type,
          start_time: format(start_time_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
          end_time: format(end_time_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
          reserved_at: format(reserved_at_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
        };
      });
  
      // Enviar las reservas del usuario al cliente
      return res.status(200).json({ userReservations });
  } catch (error) {
    console.error('Error fetching user reservations', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createReservation = async (req, res) => {
    try {
      const { user } = req.session;
      console.log(user);
      if (!user) {
        return res.status(401).json({ error: 'User not logged in' });
      }
  
      const { scenario_name, sport_type, reserved_at } = req.body;

      // Convertir fechas a UTC antes de guardar en la base de datos
      const reserved_at_utc = zonedTimeToUtc(parseISO(reserved_at), 'America/Bogota');
  
      // Convert the input date to Date object
      const reservationDate = new Date(reserved_at_utc);
      const start_time_utc = new Date(reserved_at_utc);
      const end_time_utc = new Date(reserved_at_utc);
      end_time_utc.setHours(end_time_utc.getHours() + 1);
  
      // Check if reserved_at is within the allowed range (current day and the next day)
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
  
      if (!isWithinInterval(reservationDate, { start: today, end: tomorrow })) {
        return res.status(400).json({ error: 'Reservation date must be within the current day and the next day' });
      }
  
      // Check if reserved_at is between 7 am and 8 pm
      const reservedHour = reservationDate.getHours();
      if (reservedHour < 7 || reservedHour > 20) {
        return res.status(400).json({ error: 'Reservation time must be between 7 am and maximum 8 pm' });
      }
  
      // Check if the user has already made a reservation for the specified scenario on the same day
      const existingReservation = await Reservation.count({
        where: {
          user_id: user.id,
          scenario_name,
          reserved_at: {
            [Op.between]: [reservationDate.setHours(6, 59, 59, 999), reservationDate.setHours(23, 59, 59, 999)],
          },
        },
      });

      console.log("existingReservation: " + existingReservation);
  
      if (existingReservation > 0) {
        return res.status(409).json({ error: 'User has already reserved this scenario on the same day' });
      }  
      
      // Create the reservation
      const reservationCreated = await Reservation.create({
        user_id: user.id,
        scenario_name,
        sport_type,
        start_time: start_time_utc,
        end_time: end_time_utc,
        reserved_at: reserved_at_utc,
        duration_minutes: 60,
      });

      const start_time_local = utcToZonedTime(reservationCreated.start_time, 'America/Bogota');
      const end_time_local = utcToZonedTime(reservationCreated.end_time, 'America/Bogota');
      const reserved_at_local = utcToZonedTime(reservationCreated.reserved_at, 'America/Bogota');
 
      return res.status(201).json({ message: 'Reservation created successfully', 
        reservation: {
          id: reservationCreated.id,
          scenario_name: reservationCreated.scenario_name,
          sport_type: reservationCreated.sport_type,
          start_time: format(start_time_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
          end_time: format(end_time_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
          reserved_at: format(reserved_at_local, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/Bogota' }),
        } 
      });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Handle the unique constraint violation error here
            return res.status(409).json({ error: 'Reservation already exists for the specified reserved_at time' });
        }
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

        const reserved_at_utc = zonedTimeToUtc(parseISO(reserved_at), 'America/Bogota');

        // Find and delete the reservation based on reserved_at and user_id
        const deletedReservation = await Reservation.destroy({
          where: {
              user_id: user.id,
              reserved_at: new Date(reserved_at_utc),
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