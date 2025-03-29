const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Tag = sequelize.define('tag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
})

const PreferredTags = sequelize.define('user_preferred_tags', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  tag_id: { type: DataTypes.INTEGER, allowNull: false },
})

module.exports = { Tag, PreferredTags }
