const { sequelize } = require('../db.js');
const { DataTypes } = require('sequelize');
const { Sport } = require('../models/sportModel');
const { User } = require('../models/userModel');

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
  sportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reserved_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define associations between User and Reservation models
User.hasMany(Reservation, {
  foreignKey: 'user_id',
});
Reservation.belongsTo(User, {
  foreignKey: 'user_id',
});
Reservation.belongsTo(Sport, {
  as: 'sport',
  foreignKey: 'sportId'
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
