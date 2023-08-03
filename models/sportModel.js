const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');

const Sport = sequelize.define('Sport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sport_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }
);

(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  
      // Synchronize the model with the database, creating the users table if it doesn't exist
      await Sport.sync({ alter: true });
  
      console.log('Sports table synced successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
})();

module.exports = { Sport };
