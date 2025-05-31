const Router = require('express')
const router = new Router()
const commentController = require('../controllers/commentController')
const authMiddleware = require('../middleware/AuthMiddleware')
const timeoutMiddleware = require('../middleware/TimeoutMiddleware')

router.post(
  '/create',
  authMiddleware,
  timeoutMiddleware,
  commentController.create
)
router.get(
  '/getPhotoComments',
  timeoutMiddleware,
  commentController.getPhotoComments
)
router.get('/getAllComments', commentController.getAllComments)

module.exports = router
