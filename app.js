const express = require('express')
const path = require('path')
const logger = require('morgan')
const routes = require('./routes')

const app = express()
const PORT = 3001

app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
