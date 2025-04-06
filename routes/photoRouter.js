const Router = require('express')
const router = new Router()
const photoController = require('../controllers/photoController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/create', authMiddleware, photoController.createPhoto)
router.get('/all', photoController.getAll)
router.get('/:id', photoController.getOne)
router.get('/user-photos/:id', photoController.getAllUserPhotos)

module.exports = router
