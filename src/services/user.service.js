const prisma = require('../config/prisma')
const bcrypt = require('bcrypt')

exports.getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw new Error('Utilizador não encontrado')
  }

  return user
}

exports.updateMe = async (userId, data) => {
  const { username, email, password } = data

  const existingUser = await prisma.user.findUnique({
    where: { id: Number(userId) },
  })

  if (!existingUser) {
    throw new Error('Utilizador não encontrado')
  }

  if (!username || !email) {
    throw new Error('username e email são obrigatórios')
  }

  const userWithSameUsername = await prisma.user.findFirst({
    where: {
      username,
      NOT: { id: Number(userId) },
    },
  })

  if (userWithSameUsername) {
    throw new Error('Esse username já está em uso')
  }

  const userWithSameEmail = await prisma.user.findFirst({
    where: {
      email,
      NOT: { id: Number(userId) },
    },
  })

  if (userWithSameEmail) {
    throw new Error('Esse email já está em uso')
  }

  const updatedData = {
    username,
    email,
  }

  if (password && password.trim()) {
    updatedData.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: updatedData,
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  })

  return updatedUser
}