const winston = require('winston');

// Define log levels and their corresponding colors (optional)
const logLevels = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
};

// Read the log level from the environment variable or use 'info' as the default
const logLevel = process.env.LOG_LEVEL || 'info';

// Configure the logger
const logger = winston.createLogger({
  level: logLevel, // Use the log level from the environment variable
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\n${stack}` : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
    new winston.transports.File({ filename: 'logs/combined.log' }), // Log all levels to a different file
  ],
});

module.exports = logger;
