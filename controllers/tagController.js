const ApiError = require('../error/ApiError')
const { Tag } = require('../models/models')

class TagController {
  async create(req, res, next) {
    const { name } = req.body
    if (!name) return next(ApiError.badRequest('Invalid name'))

    const tag = await Tag.create({ name }, { fields: ['id', 'name'] })
    if (!tag) return next(ApiError.badRequest())

    const minimalTag = { id: tag.id, name: tag.name }

    res.status(200).json({
      data: minimalTag,
      message: 'Tag created successfully',
      success: true,
    })
  }

  async delete(req, res, next) {
    const { id } = req.body
    if (!id) return next(ApiError.badRequest('Invalid id'))

    const tag = await Tag.destroy({ where: { id } })
    if (!tag) return next(ApiError.badRequest('Tag is not defined'))

    res.status(200).json({ message: 'Tag deleted successfully', success: true })
  }
}

module.exports = new TagController()
