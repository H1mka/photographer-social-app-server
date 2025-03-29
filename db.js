const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
  process.env.DB_NAME, // data base name
  process.env.DB_USER, // data base user
  process.env.DB_PASSWORD, // data base password
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
)
