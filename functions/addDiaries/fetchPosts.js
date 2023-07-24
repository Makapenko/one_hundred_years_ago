const axios = require('axios')

// Функция для получения описания автора по ID
async function fetchPersonDescription(url, authorId) {
  const response = await axios.get(`${url}${authorId}/1`)
  const body = response.data
  return cleanText(body.data.info)
}

// Асинхронная функция для получения заметок с API
async function fetchNotes(url) {
  const response = await axios.get(url)
  const body = response.data
  return body.data.notes
}

// Функция для форматирования имени автора
function formatAuthorName(firstName, lastName) {
  return `${firstName} ${lastName}`
}

// Функция для очистки текста от HTML-тегов и специальных символов
function cleanText(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[&\/\\#+$~%*<>{}]/g, '')
    .replace(/lt;/g, '<')
    .replace(/gt;/g, '>')
    .replace(/ndash;/g, '–')
    .replace(/laquo;/g, '«')
    .replace(/raquo;/g, '»')
    .replace(/nbsp;/g, ' ')
    .replace(/amp;/g, '&')
    .replace(/quot;/g, '"')
    
}

// Функция для получения записей дневников на определенную дату
async function fetchPosts(url, decade, fullDate, personUrl) {
  const arrayOfDiaries = []

  try {
    const notes = await fetchNotes(url)
    for (const note of notes) {
      if (note.dateTop === fullDate || note.date === fullDate) {
        const { id: authorId, firstName, lastName } = note.person
        const authorName = formatAuthorName(firstName, lastName)
        const age = note.age !== '?' ? note.age : '?'
        const cleanedText = cleanText(note.text)
        const authorDescription = await fetchPersonDescription(
          personUrl,
          authorId
        )

        arrayOfDiaries.push({
          idAuthor: authorId,
          nameAuthor: authorName,
          describeAuthor: authorDescription,
          age: age,
          text: cleanedText,
          dateDiary: fullDate,
        })

        console.log(`Дневник ${authorName} за ${decade}0 добавлен в JSON`)
      }
    }
  } catch (error) {
    console.error(`Ошибка при получении записей дневников: ${error.message}`)
  }
  return arrayOfDiaries
}

module.exports = {
  fetchPosts,
}
