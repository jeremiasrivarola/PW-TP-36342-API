const prisma = require('../config/prisma')

exports.getStats = async (userId) => {
  const where = { userId: Number(userId) }

  const totalBooks = await prisma.book.count({ where })

  const statusCountsRaw = await prisma.book.groupBy({
    by: ['status'],
    where,
    _count: { _all: true }
  })

  const totalByStatus = { READ: 0, READING: 0, TO_READ: 0 }

  for (const item of statusCountsRaw) {
    totalByStatus[item.status] = item._count._all
  }

  const genreCounts = await prisma.book.groupBy({
    by: ['genre'],
    where: { ...where, status: 'READ' },
    _count: { _all: true },
    orderBy: {
      _count: { genre: 'desc' }
    }
  })

  const mostReadGenre = genreCounts.length > 0
    ? { genre: genreCounts[0].genre, total: genreCounts[0]._count._all }
    : null

  const avgRating = await prisma.book.aggregate({
    where: { ...where, rating: { gt: 0 } },
    _avg: { rating: true }
  })

  return {
    totalBooks,
    totalByStatus,
    mostReadGenre,
    averageRating: avgRating._avg.rating
      ? Number(avgRating._avg.rating.toFixed(2))
      : null
  }
}