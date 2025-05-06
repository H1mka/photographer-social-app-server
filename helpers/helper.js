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

    const decode = jsonwebtoken.decode(token, process.env.JWT_SECRET)
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

  static createPhotoUrl(photo) {
    if (typeof photo !== 'object') return ''
    const { image, image_folder } = photo
    if (!image || !image_folder) return null

    return `${process.env.HOST_NAME}/${image_folder}/${image}`
  }

  static createUserAvatarUrl(user) {
    if (typeof user !== 'object') return ''
    const { avatar, avatar_folder } = user
    if (!avatar || !avatar_folder) return null

    return `${process.env.HOST_NAME}/${avatar_folder}/${avatar}`
  }
}

module.exports = Helper
