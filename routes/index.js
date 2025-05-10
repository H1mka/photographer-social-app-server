const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const photoRouter = require('./photoRouter')
const tagRouter = require('./tagRouter')
const commentRouter = require('./commentRouter')
const collectionRouter = require('./collectionRouter')

router.use('/user', userRouter)
router.use('/photo', photoRouter)
router.use('/tag', tagRouter)
router.use('/comment', commentRouter)
router.use('/collection', collectionRouter)

module.exports = router
