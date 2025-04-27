const Router = require('express')
const router = new Router()
const commentController = require('../controllers/commentController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/create', authMiddleware, commentController.create)
router.get('/getPhotoComments', commentController.getPhotoComments)

module.exports = router
