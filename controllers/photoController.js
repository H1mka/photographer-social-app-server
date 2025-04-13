const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const Helper = require('../helpers/helper')
const fs = require('fs')
const { Photo, Tag, User } = require('../models/models')

const tagObject = {
  model: Tag,
  attributes: ['id', 'name'],
  through: { attributes: [] },
}

class PhotoController {
  async createPhoto(req, res, next) {
    try {
      const { name, description = '', tags = [] } = req.body
      const { image } = req.files
      const { userId, userName, userLastName } = Helper.decodeJwtToken(req)
      const photoTags = JSON.parse(tags)

      /* Validations */
      if (!name) return next(ApiError.badRequest('Invalid data'))

      if (Array.isArray(image))
        return next(ApiError.badRequest('Required only one image'))
      if (!image) return next(ApiError.badRequest('Image required'))

      if (!userId || !userName || !userLastName)
        return next(ApiError.badRequest('Error with user data'))

      /* Upload photo to folder and db */
      const folderName = `${userName}_${userLastName}_${userId}`.trim()
      const uploadPath = path.resolve(__dirname, '..', 'static', folderName)
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath)
      }

      const fileName = uuid.v4() + '.jpg'
      const filePath = path.join(uploadPath, fileName)

      image.mv(filePath)
      const photo = await Photo.create({
        user_id: userId,
        name,
        description,
        image: fileName,
        image_folder: folderName,
      })

      if (!photo) return next(ApiError.badRequest())

      /* Find and assign tags to photo */
      const tagRecords = await Promise.all(
        photoTags.map(async (id) => {
          const tag = await Tag.findOne({
            where: { id },
          })
          return tag
        })
      )
      await photo.setTags(tagRecords)

      return res.status(200).json({ data: photo })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params
      if (!id) return next(ApiError.badRequest('Invalid id'))

      const photo = await Photo.findOne({
        where: { id },
        include: tagObject,
      })
      if (!photo) return next(ApiError.badRequest('Photo is not defined'))

      res.status(200).json({
        data: { ...photo.dataValues },
        message: '',
        success: true,
      })
    } catch (error) {
      next(ApiError.badRequest(error.mesage))
    }
  }

  async getAllUserPhotos(req, res, next) {
    try {
      const { id } = req.params
      if (!id) return next(ApiError.badRequest('Invalid id'))

      const photos = await Photo.findAll({
        where: { user_id: id },
        include: [
          tagObject,
          {
            model: User,
            attributes: ['id', 'name', 'last_name'],
          },
        ],
      })

      if (!photos) return next(ApiError.badRequest('Photos is not defined'))

      res.status(200).json({ data: photos, message: '', success: true })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 25 } = req.query
      const offset = page * limit - limit
      const photos = await Photo.findAndCountAll({
        include: [
          tagObject,
          {
            model: User,
            attributes: ['id', 'name', 'last_name'],
          },
        ],
        distinct: true,
        limit,
        offset,
      })

      if (!photos) return next(ApiError.badRequest('Photos is not defined'))

      res.status(200).json({ data: photos, message: '', success: true })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }
}

module.exports = new PhotoController()
