const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const app = express();
// Import the routers
const reservationRouter = require('./routes/reservationRouter');
const userRouter = require('./routes/userRouter');
const sportRouter = require('./routes/sportRouter');
// Import logger
const logger = require('./logger');

// Check if the LOG_LEVEL argument is provided
const logLevelArgIndex = process.argv.indexOf('--LOG_LEVEL');
if (logLevelArgIndex !== -1 && process.argv.length > logLevelArgIndex + 1) {
  // Get the log level from the next argument
  const logLevel = process.argv[logLevelArgIndex + 1];

  // Set the LOG_LEVEL environment variable
  process.env.LOG_LEVEL = logLevel;
}

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

// Mount the routers on the app
app.use(reservationRouter);
app.use(userRouter);
app.use(sportRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
