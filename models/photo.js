const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Photo = sequelize.define('photo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING, allowNull: false },
  image_folder: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
})

const PhotoTags = sequelize.define('photo_tags', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  photo_id: { type: DataTypes.INTEGER, allowNull: false },
  tag_id: { type: DataTypes.INTEGER, allowNull: false },
})

// const PhotoComments = sequelize.define('photo_comments', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   photo_id: { type: DataTypes.INTEGER, allowNull: false },
//   comment_id: { type: DataTypes.INTEGER, allowNull: false },
// })

// PhotoComments

module.exports = { Photo, PhotoTags }
