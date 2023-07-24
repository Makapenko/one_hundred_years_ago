const axios = require('axios')
const iconv = require('iconv-lite')
const { subtractOneDay } = require('../subtractOneDay')

const {
  extractTargetHtml,
  getHtmlParts,
  processHtmlParts,
  saveArrayToFile,
} = require('./utils')

async function addNewspaper(req) {
  const date = req.body.todayDate
  const decades = ['190', '192']
  const promises = []

  for (const decade of decades) {
    promises.push(getNewsFromStarosti(date, decade))
  }

  try {
    await Promise.all(promises)
  } catch (error) {
    console.error('Ошибка при обработке газет:', error)
  }
}

function getNewsFromStarosti(date, decade) {
  
  return new Promise(async (resolve, reject) => {
    if (decade == '192') {
      date = subtractOneDay(date)
      
    }

    const parts = date.split('-')
    const lastDigitYear = parseInt(parts[0].slice(-1))
    const month = parseInt(parts[1])
    const day = parseInt(parts[2])

    const targetUrl = `http://starosti.ru/archive.php?y=${decade}${lastDigitYear}&m=${month}&d=${day}`

    try {
      const response = await axios.get(targetUrl, {
        responseType: 'arraybuffer',
        responseEncoding: 'binary',
      })
      const htmlContent = iconv.decode(response.data, 'windows-1251')
      const targetHtml = extractTargetHtml(htmlContent)

      if (!targetHtml) {
        console.log('Не удалось найти нужный фрагмент HTML-кода')
        reject(new Error('Не удалось найти нужный фрагмент HTML-кода'))
        return
      }

      const htmlParts = getHtmlParts(targetHtml)
      const imagesByPart = processHtmlParts(htmlParts)

      saveArrayToFile(imagesByPart, `news_${decade}0.json`)
      resolve()
    } catch (error) {
      console.error('Ошибка при загрузке страницы:', error)
      reject(error)
    }
  })
}

module.exports = {
  addNewspaper,
}
