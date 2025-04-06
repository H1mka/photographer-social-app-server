const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const photoRouter = require('./photoRouter')
const tagRouter = require('./tagRouter')

router.use('/user', userRouter)
router.use('/photo', photoRouter)
router.use('/tag', tagRouter)

module.exports = router
