const Router = require('express')
const router = new Router()
const tagController = require('../controllers/tagController')

router.post('/create', tagController.create)
router.post('/delete', tagController.delete)
router.get('/getAllTags', tagController.getTags)

module.exports = router
