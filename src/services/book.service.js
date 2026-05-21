const prisma = require('../config/prisma')

const validStatuses = ['READ', 'READING', 'TO_READ']

exports.createBook = async (data, userId) => {
  const {
    title,
    author,
    genre,
    year,
    description,
    coverUrl,
    rating,
    personalNote,
    status
  } = data

  if (!title || !author || !genre || !status) {
    throw new Error('title, author, genre and status are required')
  }

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  if (rating !== undefined && rating !== null && (Number(rating) < 1 || Number(rating) > 5)) {
    throw new Error('rating must be between 1 and 5')
  }

  return prisma.book.create({
    data: {
      title,
      author,
      genre,
      year: year !== undefined && year !== null ? Number(year) : null,
      description,
      coverUrl,
      rating: rating !== undefined && rating !== null ? Number(rating) : null,
      personalNote,
      status,
      userId: Number(userId)
    }
  })
}

exports.getAllBooks = async (filters, userId) => {
  const { status, genre } = filters

  const where = {
    userId: Number(userId)
  }

  if (status) {
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status')
    }
    where.status = status
  }

  if (genre) where.genre = genre

  return prisma.book.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
}

exports.getBookById = async (id, userId) => {
  const book = await prisma.book.findFirst({
    where: {
      id: Number(id),
      userId: Number(userId)
    }
  })

  if (!book) throw new Error('Book not found')

  return book
}

exports.updateBook = async (id, data, userId) => {
  const existing = await prisma.book.findFirst({
    where: {
      id: Number(id),
      userId: Number(userId)
    }
  })

  if (!existing) throw new Error('Book not found or not authorized')

  if (data.status !== undefined && !validStatuses.includes(data.status)) {
    throw new Error('Invalid status')
  }

  if (data.rating !== undefined && data.rating !== null && (Number(data.rating) < 1 || Number(data.rating) > 5)) {
    throw new Error('rating must be between 1 and 5')
  }

  const updatedData = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.author !== undefined && { author: data.author }),
    ...(data.genre !== undefined && { genre: data.genre }),
    ...(data.year !== undefined && { year: data.year === null ? null : Number(data.year) }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
    ...(data.rating !== undefined && { rating: data.rating === null ? null : Number(data.rating) }),
    ...(data.personalNote !== undefined && { personalNote: data.personalNote }),
    ...(data.status !== undefined && { status: data.status })
  }

  return prisma.book.update({
    where: { id: Number(id) },
    data: updatedData
  })
}

exports.deleteBook = async (id, userId) => {
  const existing = await prisma.book.findFirst({
    where: {
      id: Number(id),
      userId: Number(userId)
    }
  })

  if (!existing) throw new Error('Book not found or not authorized')

  return prisma.book.delete({
    where: { id: Number(id) }
  })
}