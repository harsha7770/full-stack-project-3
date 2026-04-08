const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  menteeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.STRING,
  },
  meetingLink: {
    type: DataTypes.STRING,
  },
  mode: {
    type: DataTypes.STRING, // e.g., 'Virtual', 'In Person'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  estimatedCost: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  timestamps: true,
});

module.exports = Session;
