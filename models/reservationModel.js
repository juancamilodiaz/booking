const { Sequelize, DataTypes } = require('sequelize');
const User = require('../models/userModel');

// Replace with your PostgreSQL database connection details
const sequelize = new Sequelize('reservation_system', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  scenario_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  sport_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  reserved_at: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true,
  },
});

// Define associations between User and Reservation models
User.hasMany(Reservation, {
  foreignKey: 'user_id',
});
Reservation.belongsTo(User, {
  foreignKey: 'user_id',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronize the models with the database, creating the tables if they don't exist
    await sequelize.sync({ alter: true });

    console.log('Reservation table synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = { Reservation };
