const express = require('express')
const router = express.Router()
const controller = require('../controllers/stats.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authMiddleware)

router.get('/', controller.getStats)

module.exports = router