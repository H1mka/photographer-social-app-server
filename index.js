require('dotenv').config()

const path = require('path')
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const router = require('./routes/index')
const sequelize = require('./db')
const models = require('./models/models')
const errorMiddleware = require('./middleware/ErrorMiddleware')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// middlewares
app.use(errorMiddleware)

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
