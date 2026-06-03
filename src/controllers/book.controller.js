const bookService = require('../services/book.service')

exports.createBook = async (req, res) => {
  try {
    const result = await bookService.createBook(req.body, req.user.id, req.file)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getAllBooks = async (req, res) => {
  try {
    const result = await bookService.getAllBooks(req.query, req.user.id)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getBookById = async (req, res) => {
  try {
    const result = await bookService.getBookById(req.params.id, req.user.id)
    res.json(result)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

exports.updateBook = async (req, res) => {
  try {
    const result = await bookService.updateBook(req.params.id, req.body, req.user.id, req.file)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.deleteBook = async (req, res) => {
  try {
    const result = await bookService.deleteBook(req.params.id, req.user.id)
    res.json(result)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

exports.createBook = async (req, res) => {
  try {
    console.log('BODY:', req.body)
    console.log('FILE:', req.file)

    const result = await bookService.createBook(req.body, req.user.id, req.file)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}