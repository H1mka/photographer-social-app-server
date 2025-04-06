const ApiError = require('../error/ApiError')

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message })
  }

  res.status(500).json({ message: 'Unexpected Error' })
}

module.exports = errorMiddleware
