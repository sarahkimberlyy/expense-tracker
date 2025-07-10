// models/Expense.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // adjust path based on your structure

const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'expenses',
  timestamps: true
});

module.exports = Expense;