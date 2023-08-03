const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, deleteReservation, getReservations } = require('../controllers/reservationController');

// Define routes for reservations
router.get('/reservations/:sport_name', getReservations);
router.get('/reservationsByUser/:sport_name', getUserReservations);
router.post('/reservations', createReservation);
router.delete('/reservations/:reserved_at', deleteReservation);

module.exports = router;
