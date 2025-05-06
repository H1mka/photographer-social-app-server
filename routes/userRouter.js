const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/check', authMiddleware, userController.checkAuth)

module.exports = router
