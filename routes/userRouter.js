const express = require('express');
const router = express.Router();
const { register, login, logout, sessionStatus } = require('../controllers/userController');

// Define routes for users
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/sessionStatus', sessionStatus);

module.exports = router;
