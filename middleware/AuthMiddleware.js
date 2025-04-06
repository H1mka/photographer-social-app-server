const ApiError = require('../error/ApiError')
const Helper = require('../helpers/helper')

const authMiddleware = (req, res, next) => {
  try {
    const verifiedUser = Helper.verifyJwtToken(req)
    if (!verifiedUser) return next(ApiError.unAuthorized())
    req.user = verifiedUser

    next()
  } catch (error) {
    return next(ApiError.unAuthorized())
  }
}

module.exports = authMiddleware
