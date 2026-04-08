const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'mentor', 'mentee'),
    allowNull: false,
  },
  expertise: {
    type: DataTypes.JSON, // For arrays like ['Web Dev', 'React']
    defaultValue: [],
  },
  interests: {
    type: DataTypes.JSON, // For arrays like ['UI/UX']
    defaultValue: [],
  },
  bio: {
    type: DataTypes.TEXT,
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  hourlyRate: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  timestamps: true,
});

module.exports = User;
