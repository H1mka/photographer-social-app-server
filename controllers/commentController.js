const ApiError = require('../error/ApiError')
const Helper = require('../helpers/helper')
const { Comment, User } = require('../models/models')

const userObject = {
  model: User,
  attributes: ['id', 'name', 'last_name', 'avatar', 'avatar_folder'],
}

class CommentController {
  async create(req, res, next) {
    const { user_id, photo_id, description } = req.body

    if (!user_id || !photo_id)
      return next(ApiError.badRequest('Invalid user or photo id'))

    if (!description)
      return next(ApiError.badRequest('The comment text is required'))

    const comment = await Comment.create({
      user_id,
      photo_id,
      description,
    })

    if (!comment) return next(ApiError.badRequest())

    res.status(200).json({
      data: {},
      message: 'The comment was successfully created',
      success: true,
    })
  }

  async getPhotoComments(req, res, next) {
    const { photo_id } = req.query

    if (!photo_id) return next(ApiError.badRequest('Invalid photo_id'))

    const comments = await Comment.findAll({
      where: { photo_id },
      include: [userObject],
    })
    if (!comments) return next(ApiError.badRequest())

    comments.forEach((item) => {
      const { user } = item
      user.dataValues.avatar_src = Helper.createUserAvatarUrl(user)
    })

    res.status(200).json({
      data: comments,
      success: true,
    })
  }
}

module.exports = new CommentController()
