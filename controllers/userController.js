const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const FilesHelper = require('../helpers/filesHelper')
const ApiError = require('../error/ApiError')
const validator = require('../helpers/validator')
const Helper = require('../helpers/helper')
const { User } = require('../models/models')

const prepareUserData = (user = {}) => {
  if (typeof user !== 'object') return {}

  const { id, name, last_name, email, role, avatar, bio, avatar_folder } = user
  const avatar_src =
    avatar && avatar_folder ? Helper.createUserAvatarUrl(user) : null

  return { id, name, last_name, email, role, bio, avatar_src }
}

const createJWTToken = (user = {}) => {
  if (typeof user !== 'object') return ''
  const { id, name, last_name, email } = user

  return jsonwebtoken.sign(
    { id, name, last_name, email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
}

class UserController {
  async registration(req, res, next) {
    const { name, last_name, email, password, desciption } = req.body
    const { avatar = null } = req.files || {}

    if (!validator.validatePassword(password))
      return next(
        ApiError.badRequest('Password must be greater than 6 symbols')
      )

    if (!name || !last_name || !email)
      return next(ApiError.badRequest('Invalid data'))

    const findUser = await User.findOne({ where: { email } })

    if (findUser)
      return next(ApiError.badRequest('User with current email already exist'))

    const hashPassword = await bcrypt.hash(password, 5)

    const user = await User.create({
      name,
      last_name,
      email,
      password: hashPassword,
      desciption,
    })

    if (!user) return next(ApiError.badRequest())

    // save avatar image
    if (avatar) {
      const filesHelper = new FilesHelper(name, last_name, user.id, 'avatar_')
      filesHelper.uploadPhotoToFolder(avatar)

      user.avatar = filesHelper.fileName
      user.avatar_folder = filesHelper.folderName
      await user.save()
    }

    res.status(200).json({
      data: prepareUserData(user),
      jwt: createJWTToken(user),
      message: 'Registration successfuly',
      success: true,
    })
  }

  async login(req, res, next) {
    const { email, password } = req.body

    if (!email || !password) return next(ApiError.badRequest('Invalid data'))

    const user = await User.findOne({ where: { email } })
    if (!user)
      return next(ApiError.badRequest("User with current email doesn't exist"))

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return next(ApiError.badRequest('Wrong password'))

    res.status(200).json({
      data: prepareUserData(user),
      jwt: createJWTToken(user),
      message: 'Login successfuly',
      success: true,
    })
  }

  async checkAuth(req, res, next) {
    const { userId } = Helper.decodeJwtToken(req)
    const user = await User.findOne({ where: { id: userId } })
    if (!user) next(ApiError.badRequest())

    res.status(200).json({
      data: prepareUserData(user),
      jwt: createJWTToken(user),
      message: '',
      success: true,
    })
  }

  async getUserInfo(req, res, next) {
    const { id } = req.params
    if (!id) return next(ApiError.badRequest('Wrong user id'))

    const user = await User.findByPk(id)
    if (!user) return next(ApiError.badRequest())

    res.status(200).json({
      data: prepareUserData(user),
      success: true,
    })
  }
}

module.exports = new UserController()
