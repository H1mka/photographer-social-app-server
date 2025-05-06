const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  avatar_folder: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
})

module.exports = { User }
