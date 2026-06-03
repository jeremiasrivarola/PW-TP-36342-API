const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth.routes')
const bookRoutes = require('./routes/book.routes')
const statsRoutes = require('./routes/stats.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/auth', authRoutes)
app.use('/books', bookRoutes)
app.use('/stats', statsRoutes)

module.exports = app