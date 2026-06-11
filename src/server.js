const app = require('./app')

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.status(200).json('Welcome!');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})