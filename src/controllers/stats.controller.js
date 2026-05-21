const statsService = require('../services/stats.service')

exports.getStats = async (req, res) => {
  try {
    const result = await statsService.getStats(req.user.id)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}