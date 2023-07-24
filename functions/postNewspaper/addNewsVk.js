require('dotenv').config()
const axios = require('axios')
const FormData = require('form-data')
const publishImage = require('../publishImage.js')
const { readJsonFile } = require('../readJsonFile.js')
const {
  getFullDateAndFilePathDate,
} = require('../getFullDateAndFilePathDate.js')
const { subtractOneDay } = require('../subtractOneDay')

async function addNewsVk(dateNow, group, postPeriod, now) {
  const token = process.env.VK_ACCESS_TOKEN

  const groupPost = `-${group}`
  const halfDate = dateNow.split('').slice(3).join('')
  let { fullDate, filePathDate } = await getFullDateAndFilePathDate(
    groupPost,
    halfDate
  )
  const dateForText = fullDate.split('').slice(0, 4).join('')
  const filePath = `notes/news_${filePathDate}.json`

  let newsArray = await readJsonFile(filePath)
    .then(jsonArray => {
      return jsonArray
    })
    .catch(error => {
      console.error(
        'Ошибка при чтении файла или преобразовании JSON (новости):',
        error
      )
      return [] // Вернуть пустой массив в качестве значения по умолчанию
    })

  console.log(
    'Длина массива новостей: ' + newsArray.length + ' за дату ' + fullDate
  )

  let indexOfNews = 0
  let message = ''
  let firstLine

  if (filePathDate == '1920') {
    fullDate = subtractOneDay(fullDate)
    firstLine = `${fullDate} (вчерашние новости)`
  } else {
    firstLine = `${fullDate}`
  }

  if (newsArray.length === 0) {
    console.log('Новостные элементы не найдены. Пропуск публикации.')
  } else {
    let idTimer = setInterval(async () => {
      const { text, images } = newsArray[indexOfNews]
      let publishDate = 0

      message = `${firstLine}\n------------------\n${text}\n\n #${dateForText}год`

      publishDate = Math.round(
        now + (postPeriod / newsArray.length) * (indexOfNews + 1)
      )

      async function uploadImages(images, PARAM_GROUP) {
        const uploadPromises = images.map(async photoLink => {
          return await publishImage(photoLink, PARAM_GROUP)
        })

        const photoAnswers = await Promise.all(uploadPromises)
        return photoAnswers
      }

      const PARAM_GROUP = groupPost.slice(1)
      const photoAnswers = await uploadImages(images, PARAM_GROUP)
      const form = new FormData()
      form.append('message', message)
      form.append('oauth', 1)
      form.append('owner_id', groupPost)

      // Собираем успешно загруженные фотографии
      const successfulPhotoAnswers = photoAnswers.filter(
        answer => !answer.error
      )
      const attachments = successfulPhotoAnswers
        .map(
          answer =>
            `photo${answer.response[0].owner_id}_${answer.response[0].id}`
        )
        .join(',')

      if (attachments) {
        form.append('attachments', attachments)
      }
      form.append('publish_date', publishDate)

      const response = await axios.post(
        'https://api.vk.com/method/wall.post',
        form,
        {
          params: {
            access_token: token,
            v: '5.81',
          },
        }
      )

      console.log('publish_date: ' + publishDate)
      console.log(`Опубликована ${indexOfNews} запись`)

      // увеличение таймера
      indexOfNews++
      // остановка таймера
      if (indexOfNews >= newsArray.length) {
        console.log('timer is stop ' + idTimer)
        clearInterval(idTimer)
      }
    }, 30000)
  }
}

module.exports = {
  addNewsVk,
}
