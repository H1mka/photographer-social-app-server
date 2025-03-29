const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  photo_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
})

module.exports = { Comment }
