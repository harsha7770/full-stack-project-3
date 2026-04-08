const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Set to true to see SQL queries in console
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error);
    // Suggest creating the database if it doesn't exist
    if (error.original && error.original.errno === 1049) {
        console.log('HINT: Make sure to create the database "mentorship_db" in your MySQL server.');
    }
  }
};

module.exports = { sequelize, connectDB };
