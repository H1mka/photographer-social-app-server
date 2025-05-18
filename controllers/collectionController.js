const ApiError = require('../error/ApiError')
const { prepareUserData } = require('../helpers/user')
const Helper = require('../helpers/helper')
const {
  Collection,
  CollectionPhotos,
  Photo,
  User,
  Tag,
} = require('../models/models')

const userObject = {
  model: User,
}

const tagObject = {
  model: Tag,
  attributes: ['id', 'name'],
  through: { attributes: [] },
}

class CollectionController {
  async createCollection(req, res, next) {
    const { name, description } = req.body
    const { user } = req

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

  async getCollection(req, res, next) {
    try {
      const { id } = req.query
      if (!id) return next(ApiError.badRequest('Please, try later'))

      const collection = await Collection.findByPk(id, {
        include: [userObject],
      })
      if (!collection)
        return next(ApiError.badRequest("Collection doesn't exist"))
      const photosCount = await collection.countPhotos()
      const collectionData = collection.toJSON()

      res.status(200).json({
        data: {
          ...collectionData,
          user: prepareUserData(collectionData.user),
          photosCount,
        },
        success: true,
      })
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async getCollectionPhotos(req, res, next) {
    try {
      const { id: collection_id } = req.query
      const { page = 1, limit = 25 } = req.query
      const offset = page * limit - limit
      if (!collection_id) return next(ApiError.badRequest('Invalid id'))

      const collection = await Collection.findByPk(collection_id)

      if (!collection) return next(ApiError.badRequest('Collection not found'))

      const photos = await Photo.findAndCountAll({
        include: [
          {
            model: Collection,
            where: { id: collection_id },
            attributes: [],
            through: { attributes: [] },
          },
          tagObject,
          userObject,
        ],
        distinct: true,
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
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

  async getUserCollectionsNames(req, res, next) {
    const { user_id } = req.query
    if (!user_id) return next(ApiError.badRequest('Wrong user id'))

    const collections = await Collection.findAll({ where: { user_id } })

    if (!collections) return next(ApiError.badRequest('No collections'))

    const formatted = collections.map((item) => {
      const { id, name } = item.toJSON()
      return { value: id, name }
    })

    res.status(200).json({
      data: formatted,
      success: true,
    })
  }
}

module.exports = new CollectionController()
