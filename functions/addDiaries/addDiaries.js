// Импортируем необходимые модули
const fs = require('fs').promises
const { fetchPosts } = require('./fetchPosts.js')

// Определяем базовые URL для API
const PERSON_API_BASE_URL = 'https://corpus.prozhito.org/api/persons/lang/'
const NOTES_API_BASE_URL =
  'https://corpus.prozhito.org/api/notes/search?search_type=diaries&date='

const OFFSETS = [0, 25, 50, 75]

// Функция для создания URL с параметрами
function createNotesApiUrl(decade, halfDate, offset) {
  return `${NOTES_API_BASE_URL}${decade}${halfDate}&offset=${offset}`
}

// Функция для получения записей дневников за определенное десятилетие
async function fetchDiariesForDecade(date, decade, personUrl) {
  const halfDate = date.split('').slice(3).join('')
  const fullDate = decade + halfDate

  const requests = OFFSETS.map(offset => {
    const url = createNotesApiUrl(decade, halfDate, offset)
    return fetchPosts(url, decade, fullDate, personUrl)
  })

  const arrayOfDiaries = (await Promise.all(requests)).flat()

  console.log(`За ${decade}0-e добавлены ${arrayOfDiaries.length} дневников!`)
  return arrayOfDiaries
}

// Функция для получения имени файла по десятилетию
function getFileName(decade) {
  return `diaries_${decade}0s.json`
}

// Основная функция для добавления записей дневников
async function addDiaries(req, res) {
  const date = req.body.todayDate
  const decades = ['190', '192', '194']
  const promises = []

  // Цикл для обработки каждого десятилетия
  for (const decade of decades) {
    const fetchDiariesPromise = fetchDiariesForDecade(
      date,
      decade,
      PERSON_API_BASE_URL
    )

    // Добавляем промис для записи дневников в файл после обработки
    promises.push(
      fetchDiariesPromise.then(async arrayOfDiaries => {
        arrayOfDiaries.sort((a, b) => b.text.length - a.text.length)

        const fileName = getFileName(decade)
        await fs.writeFile(`notes/${fileName}`, JSON.stringify(arrayOfDiaries, null, 2))
      })
    )
  }

  // Дожидаемся выполнения всех промисов
  await Promise.all(promises)

}

// Экспортируем функцию addDiaries для использования в других модулях
module.exports = {
  addDiaries,
}
