const ApiError = require('../error/ApiError')
const { prepareUserData } = require('../helpers/user')
const Helper = require('../helpers/helper')
const {
  Collection,
  CollectionPhotos,
  Photo,
  User,
} = require('../models/models')

const userObject = {
  model: User,
}

class CollectionController {
  async createCollection(req, res, next) {
    const { name, description } = req.body
    const { user } = req
    console.log(name)
    if (!name) return next(ApiError.badRequest('Name is required'))
    if (!user?.id) return next(ApiError.badRequest('Something went wrong'))

    try {
      const collection = await Collection.create({
        user_id: user?.id,
        name,
        description,
      })

      if (!collection)
        return next(
          ApiError.badRequest(
            'Error when creating a collection. Try again later'
          )
        )

      res.status(200).json({
        data: collection,
        message: 'Collection was successfully created',
        success: true,
      })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async addPhotoToCollection(req, res, next) {
    const { photo_ids = [], collection_id } = req.body

    if (!Array.isArray(photo_ids) || !photo_ids.length || !collection_id)
      return next(ApiError.badRequest('Invalid data'))

    try {
      const collection = await Collection.findByPk(collection_id)
      if (!collection) return next(ApiError.badRequest('Collection not found'))

      const existingLinks = await CollectionPhotos.findAll({
        where: {
          collection_id,
          photo_id: photo_ids,
        },
      })

      const existingPhotoIds = existingLinks.map((link) => link.photo_id)
      const newPhotoIds = photo_ids.filter(
        (id) => !existingPhotoIds.includes(Number(id))
      )

      const photos = await Photo.findAll({
        where: { id: newPhotoIds },
      })

      if (!photos.length)
        return res.status(200).json({
          message: 'No new photos to add',
          success: true,
        })

      await collection.addPhotos(photos)

      res.status(200).json({
        message: 'Photo was added succesfully',
        success: true,
      })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async getCollectionsPreview(req, res, next) {
    try {
      const { user_id } = req.query
      const where = user_id ? { user_id } : {}
      const photoLimit = 4

      const collections = await Collection.findAll({
        where,
        include: [userObject],
      })

      const formatted = await Promise.all(
        collections.map(async (collection) => {
          const data = collection.toJSON()
          const photos = await collection.getPhotos({
            limit: photoLimit,
            order: [['createdAt', 'DESC']],
          })
          const photosCount = await collection.countPhotos()

          return {
            ...data,
            photos: photos.map((item) => ({
              id: item.id,
              name: item.name,
              src: Helper.createPhotoUrl(item),
            })),
            photosCount,
            user: prepareUserData(data.user),
          }
        })
      )

      res.status(200).json({
        data: formatted,
        success: true,
      })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }
}

module.exports = new CollectionController()
