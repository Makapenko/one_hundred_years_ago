const { addNewspaper } = require('./addNewspaper/addNewspaper');
const { addDiaries } = require('./addDiaries/addDiaries');

// Функция, объединяющая обработчики
async function addNotes(req, res) {
  try {
    await addNewspaper(req); // передайте только req, чтобы обработчик не мог отправить ответ
    await addDiaries(req); // передайте только req, чтобы обработчик не мог отправить ответ

    // Отправьте общий ответ здесь
    res.status(200).send('Операция выполнена успешно');
  } catch (error) {
    console.error('Ошибка в объединенном обработчике:', error);
    res.status(500).send('Произошла ошибка');
  }
}

module.exports = {
  addNotes
}
