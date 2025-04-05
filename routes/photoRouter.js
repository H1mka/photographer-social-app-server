const Router = require('express')
const router = new Router()
const photoController = require('../controllers/photoController')

router.post('/create', photoController.createPhoto)
router.get('/:id', photoController.getOne)
router.get('/user-photos/:id', photoController.getAllUserPhotos)

module.exports = router
