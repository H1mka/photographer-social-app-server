require('dotenv').config()

const express = require('express')
const cors = require('cors')

const sequelize = require('./db')
const modals = require('./models/models')
const app = express()
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log('Server start on port', PORT))
  } catch (error) {
    console.log(error)
  }
}

start()
