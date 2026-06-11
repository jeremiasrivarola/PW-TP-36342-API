const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json('Welcome!');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})