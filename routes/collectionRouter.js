const Router = require('express')
const router = new Router()
const collectionController = require('../controllers/collectionController')
const authMiddleware = require('../middleware/AuthMiddleware')
// const timeoutMiddleware = require('../middleware/TimeoutMiddleware')

router.post('/create', authMiddleware, collectionController.createCollection)
router.post(
  '/addPhotoToCollection',
  authMiddleware,
  collectionController.addPhotoToCollection
)
router.get('/getCollectionsPreview', collectionController.getCollectionsPreview)
router.get('/getCollection', collectionController.getCollection)
router.get('/getCollectionPhotos', collectionController.getCollectionPhotos)

module.exports = router
