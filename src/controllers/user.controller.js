const userService = require('../services/user.service')

exports.getMe = async (req, res) => {
  try {
    const result = await userService.getMe(req.user.id)
    res.json(result)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

exports.updateMe = async (req, res) => {
  try {
    const result = await userService.updateMe(req.user.id, req.body)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}