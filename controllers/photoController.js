const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const Helper = require('../helpers/helper')
const fs = require('fs')
const { Photo } = require('../models/photo')

class PhotoController {
  async createPhoto(req, res, next) {
    try {
      const { name, description = '' } = req.body
      const { image } = req.files
      const { userId, userName, userLastName } = Helper.decodeJwtToken(req)
      console.log(userId, userName, userLastName)

      if (!name) return next(ApiError.badRequest('Invalid data'))

      if (Array.isArray(image))
        return next(ApiError.badRequest('Required only one image'))
      if (!image) return next(ApiError.badRequest('Image required'))

      if (!userId || !userName || !userLastName)
        return next(ApiError.badRequest('Error with user data'))

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
      })

      if (!photo) return next(ApiError.badRequest())

      return res.status(200).json({ data: photo })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params
      if (!id) return next(ApiError.badRequest('Invalid id'))

      const photo = await Photo.findOne({ where: { id } })
      if (!photo) return next(ApiError.badRequest('Photo is not defined'))

      res
        .status(200)
        .json({ data: { ...photo.dataValues }, message: '', success: true })
    } catch (error) {
      next(ApiError.badRequest(error.mesage))
    }
  }

  async getAllUserPhotos(req, res, next) {
    try {
      const { id } = req.params
      if (!id) return next(ApiError.badRequest('Invalid id'))

      const photos = await Photo.findAll({ where: { user_id: id } })
      if (!photos) return next(ApiError.badRequest('Photo is not defined'))

      const data = photos.map((item) => ({ ...item.dataValues }))

      res.status(200).json({ data, message: '', success: true })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }
}

module.exports = new PhotoController()
