const { Sequelize } = require('sequelize');

// Replace the values below with your actual database credentials and settings
const database = 'reservation_system';
const username = 'postgres';
const password = 'admin';
const host = 'localhost'; // Change this to your database host if needed
const dialect = 'postgres'; // Change this to your database dialect (e.g., 'mysql', 'sqlite', 'mssql')

// Create a Sequelize instance with the database configuration
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  dialectOptions: {
    // Set the preferred timezone
    timezone: 'America/Bogota',
  },
});

module.exports = { sequelize };
