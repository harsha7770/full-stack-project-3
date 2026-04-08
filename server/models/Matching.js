const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Matching = sequelize.define('Matching', {
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
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,
});

module.exports = Matching;
