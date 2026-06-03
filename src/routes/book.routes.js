const express = require('express')
const router = express.Router()
const controller = require('../controllers/book.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')

router.use(authMiddleware)

router.post('/', upload.single('cover'), controller.createBook)
router.get('/', controller.getAllBooks)
router.get('/:id', controller.getBookById)
router.put('/:id', upload.single('cover'), controller.updateBook)
router.delete('/:id', controller.deleteBook)

module.exports = router