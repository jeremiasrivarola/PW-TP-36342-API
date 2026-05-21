const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token missing' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, SECRET)

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
} 