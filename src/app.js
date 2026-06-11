const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth.routes')
const bookRoutes = require('./routes/book.routes')
const statsRoutes = require('./routes/stats.routes')
const userRoutes = require('./routes/user.routes')

const app = express()

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/books', bookRoutes)
app.use('/users', userRoutes)
app.use('/stats', statsRoutes)

module.exports = app