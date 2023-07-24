const { postNewspaper } = require('./postNewspaper/postNewspaper')
const { postDiaries } = require('./postDiaries/postDiaries')

// Функция, объединяющая обработчики
async function postNotes(req, res) {
  try {
    await postNewspaper(req)
    await postDiaries(req)

    // Отправьте общий ответ здесь
    res.status(200).send('Операция выполнена успешно')
  } catch (error) {
    console.error('Ошибка в объединенном обработчике:', error)
    res.status(500).send('Произошла ошибка')
  }
}

module.exports = {
  postNotes,
}
