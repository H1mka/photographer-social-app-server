const jsonwebtoken = require('jsonwebtoken')

class Helper {
  static decodeJwtToken(req) {
    let { authorization = '' } = req.headers
    authorization = authorization.split(' ')[1]
    if (!authorization) return {}

    const decode = jsonwebtoken.decode(authorization, process.env.JWT_SECRET)
    return {
      userId: decode.id,
      userName: decode.name,
      userLastName: decode.last_name,
    }
  }
}

module.exports = Helper
