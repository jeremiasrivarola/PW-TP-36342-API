const prisma = require('../config/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET

exports.register = async ({ username, email, password }) => {
  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, email, password: hashed }
  })

  return user
}

exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) throw new Error('User not found')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Wrong password')

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' })

  return { token }
}