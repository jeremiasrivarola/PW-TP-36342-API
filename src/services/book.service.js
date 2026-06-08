const prisma = require('../config/prisma')
const fs = require('fs')
const path = require('path')

const validStatuses = ['READ', 'READING', 'TO_READ']

exports.createBook = async (data, userId, file) => {
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

  let normalizedRating = null

  if (status === 'READ') {
    if (
      rating === undefined ||
      rating === null ||
      rating === '' ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      throw new Error('rating must be between 1 and 5 when status is READ')
    }
    normalizedRating = Number(rating)
  } else {
    if (rating !== undefined && rating !== null && rating !== '') {
      const numericRating = Number(rating)

      if (numericRating < 0 || numericRating > 5) {
        throw new Error('rating must be between 0 and 5')
      }

      normalizedRating = numericRating
    } else {
      normalizedRating = 0
    }
  }

  let finalCoverUrl = coverUrl || null

  if (file) {
    finalCoverUrl = `/uploads/covers/${file.filename}`
  }

  return prisma.book.create({
    data: {
      title,
      author,
      genre,
      year: year !== undefined && year !== null && year !== '' ? Number(year) : null,
      description,
      coverUrl: finalCoverUrl,
      rating: normalizedRating,
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

exports.updateBook = async (id, data, userId, file) => {
  const existing = await prisma.book.findFirst({
    where: {
      id: Number(id),
      userId: Number(userId)
    }
  })

  if (!existing) throw new Error('Book not found or not authorized')

  const nextStatus = data.status !== undefined ? data.status : existing.status

  if (!validStatuses.includes(nextStatus)) {
    throw new Error('Invalid status')
  }

  const rawRating = data.rating !== undefined ? data.rating : existing.rating
  let normalizedRating = existing.rating

  if (nextStatus === 'READ') {
    if (
      rawRating === undefined ||
      rawRating === null ||
      rawRating === '' ||
      Number(rawRating) < 1 ||
      Number(rawRating) > 5
    ) {
      throw new Error('rating must be between 1 and 5 when status is READ')
    }
    normalizedRating = Number(rawRating)
  } else {
    if (data.rating !== undefined) {
      if (data.rating === null || data.rating === '') {
        normalizedRating = 0
      } else {
        const numericRating = Number(data.rating)

        if (numericRating < 0 || numericRating > 5) {
          throw new Error('rating must be between 0 and 5')
        }

        normalizedRating = numericRating
      }
    } else if (existing.status === 'READ' && nextStatus !== 'READ') {
      normalizedRating = 0
    }
  }

  const updatedData = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.author !== undefined && { author: data.author }),
    ...(data.genre !== undefined && { genre: data.genre }),
    ...(data.year !== undefined && {
      year: data.year === null || data.year === '' ? null : Number(data.year)
    }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.personalNote !== undefined && { personalNote: data.personalNote }),
    ...(data.status !== undefined && { status: data.status }),
    rating: normalizedRating
  }

  if (file) {
    updatedData.coverUrl = `/uploads/covers/${file.filename}`
  } else if (data.coverUrl !== undefined) {
    updatedData.coverUrl = data.coverUrl
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

  if (
    existing.coverUrl &&
    existing.coverUrl.startsWith('/uploads/covers/')
  ) {
    const relativeFilePath = existing.coverUrl.replace(/^\/+/, '')
    const absoluteFilePath = path.join(process.cwd(), relativeFilePath)

    if (fs.existsSync(absoluteFilePath)) {
      fs.unlinkSync(absoluteFilePath)
    }
  }

  return prisma.book.delete({
    where: { id: Number(id) }
  })
}