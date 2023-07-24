const express = require('express')
const router = express.Router()
const { fetchDiaries } = require('./functions')
const { addNotes } = require('./functions/addNotes')
const { postNotes } = require('./functions/postNotes')

router.get('/', (req, res) => {
  res.render('index', { title: 'Diary' })
})

router.post('/postDiaries', postNotes)
router.post('/addDiaries', addNotes)

router.get('/a', fetchDiaries)

module.exports = router
