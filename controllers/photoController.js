const ApiError = require('../error/ApiError')
const Helper = require('../helpers/helper')
const FilesHelper = require('../helpers/filesHelper')
const { Photo, Tag, User } = require('../models/models')

const tagObject = {
  model: Tag,
  attributes: ['id', 'name'],
  through: { attributes: [] },
}

const userObject = {
  model: User,
  attributes: ['id', 'name', 'last_name'],
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
      const filesHelper = new FilesHelper(userName, userLastName, userId)
      filesHelper.uploadPhotoToFolder(image)

      const photo = await Photo.create({
        user_id: userId,
        name,
        description,
        image: filesHelper.fileName,
        image_folder: filesHelper.folderName,
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
        include: [tagObject, userObject],
      })
      if (!photo) return next(ApiError.badRequest('Photo is not defined'))

      // add photo src
      photo.dataValues.src = Helper.createPhotoUrl(photo)

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
      const { page = 1, limit = 25 } = req.query
      const offset = page * limit - limit
      if (!id) return next(ApiError.badRequest('Invalid id'))

      const photos = await Photo.findAndCountAll({
        where: { user_id: id },
        include: [tagObject, userObject],
        distinct: true,
        limit,
        offset,
      })

      if (!photos) return next(ApiError.badRequest('Photos is not defined'))

      // add photo src
      photos.rows = photos.rows.map((item) => {
        item.dataValues.src = Helper.createPhotoUrl(item)
        return item
      })

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
        include: [tagObject, userObject],
        distinct: true,
        limit,
        offset,
      })

      if (!photos) return next(ApiError.badRequest('Photos is not defined'))

      // add photo src
      photos.rows = photos.rows.map((item) => {
        item.dataValues.src = Helper.createPhotoUrl(item)
        return item
      })

      res.status(200).json({ data: photos, message: '', success: true })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }
}

module.exports = new PhotoController()
