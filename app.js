const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const app = express();

// Other imports here...

// Replace with your PostgreSQL database connection details
const sessionStore = new pgSession({
  conString: 'postgres://postgres:admin@localhost:5432/reservation_system',
});

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Configure session middleware
app.use(
  session({
    store: sessionStore,
    secret: '16sJWwAwXT4IheQZ7tjhsFp15Frkn2ty', // Replace with your own secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,//7 * 24 * 60 * 60 * 1000, // Session will expire in 7 days
      secure: false, // Set to 'true' for production if using HTTPS
      httpOnly: true,
    },
  })
);

// Register the routes
const userController = require('./controllers/userController');
app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/logout', userController.logout);
app.get('/sessionStatus', userController.sessionStatus);

// Reservations endpoint
const reservationController = require('./controllers/reservationController');
app.get('/reservations', reservationController.getReservations);
app.get('/reservationsByUser', reservationController.getUserReservations);
app.post('/reservations', reservationController.createReservation);
app.delete('/reservations/:reserved_at', reservationController.deleteReservation);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
