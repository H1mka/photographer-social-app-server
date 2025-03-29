const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Collection = sequelize.define('collection', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
})

const CollectionPhotos = sequelize.define('collection_photos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  collection_id: { type: DataTypes.INTEGER, allowNull: false },
  photo_id: { type: DataTypes.INTEGER, allowNull: false },
})

module.exports = { Collection, CollectionPhotos }
