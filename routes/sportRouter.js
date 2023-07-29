// In your Express router file (e.g., sportRouter.js)
const express = require('express');
const router = express.Router();
const { getSports, createSport, updateSport, deleteSport } = require('../controllers/sportController');

// Define the route to fetch all sports
router.get('/sports', getSports);
router.post('/sports/create', createSport);
router.put('/sports/:sportId', updateSport);
router.delete('/sports/sport_name', deleteSport);

module.exports = router;
