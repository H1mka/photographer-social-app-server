const jsonwebtoken = require('jsonwebtoken')

class Helper {
  static getJwtTokenFromRequest(req = {}) {
    const { authorization = '' } = req.headers
    const token = authorization.split(' ')[1]

    return token || null
  }

  static decodeJwtToken(req) {
    const token = Helper.getJwtTokenFromRequest(req)
    if (!token) return {}

    const decode = jsonwebtoken.decode(authorization, process.env.JWT_SECRET)
    return {
      userId: decode.id,
      userName: decode.name,
      userLastName: decode.last_name,
    }
  }

  static verifyJwtToken(req) {
    const token = Helper.getJwtTokenFromRequest(req)
    if (!token) return false

    return jsonwebtoken.verify(token, process.env.JWT_SECRET)
  }
}

module.exports = Helper
