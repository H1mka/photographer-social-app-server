const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const ApiError = require('../error/ApiError')
const validator = require('../helpers/validator')
const { User } = require('../models/models')

class UserController {
  async registration(req, res, next) {
    const { name, last_name, email, password, desciption, photo } = req.body

    if (!validator.validatePassword(password))
      return next(
        ApiError.badRequest('Password must be greater than 6 symbols')
      )

    if (!name || !last_name || !email)
      return next(ApiError.badRequest('Invalid data'))

    const findUser = await User.findOne({ where: { email } })

    if (findUser)
      return next(ApiError.badRequest('User with current email exist'))

    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({
      name,
      last_name,
      email,
      password: hashPassword,
      desciption,
    })

    const jwt = jsonwebtoken.sign(
      { id: user.id, name, last_name, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(200).json(jwt)
  }

  async authorization(req, res) {
    const { email, password } = req.body
  }

  async auth(req, res, next) {
    const { id } = req.query
    if (!id) return next(ApiError.badRequest('Id is not defined'))

    res.status(200).json({ message: 'Test' + id })
  }
}

module.exports = new UserController()
