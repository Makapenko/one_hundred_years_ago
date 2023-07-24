require('dotenv').config()
const axios = require('axios')
const FormData = require('form-data')
const publishImage = require('../publishImage.js')
const { readJsonFile } = require('../readJsonFile')
const {
  getFullDateAndFilePathDate,
} = require('../getFullDateAndFilePathDate.js')
const { getAgeEnding } = require('../getAgeEnding.js')

async function addInVk(dateNow, group, postPeriod, now) {
  const token = process.env.VK_ACCESS_TOKEN

  const groupPost = `-${group}`
  const halfDate = dateNow.split('').slice(3).join('')
  const { fullDate, filePathDate } = await getFullDateAndFilePathDate(
    groupPost,
    halfDate
  )

  const dateForText = fullDate.split('').slice(0, 4).join('')
  const filePath = `notes/diaries_${filePathDate}s.json`

  let diariesArray = await readJsonFile(filePath)
    .then(jsonArray => {
      return jsonArray
    })
    .catch(error => {
      console.error(
        'Ошибка при чтении файла или преобразовании JSON (дневники):',
        error
      )
    })

  console.log(
    'Длина массива дневников: ' + diariesArray.length + ' за дату ' + fullDate
  )

  let indexOfDiary = 0
  let message = ''
  let idTimer = setInterval(async () => {
    const { nameAuthor, age, describeAuthor, text, idAuthor } =
      diariesArray[indexOfDiary]
    const ageEnding = age ? getAgeEnding(age) : ''
    let photoLink
    let publishDate = 0

    if (indexOfDiary >= 47) {
      // если запись после 47-ой
      publishDate = 0
      message += `${nameAuthor} (${age} ${ageEnding}) - ${describeAuthor}\n${fullDate}\n${text} \n\n ———————————————————————— \n\n`
      console.log(`Добавлена ${indexOfDiary} запись в последний пост`)
      if (indexOfDiary == diariesArray.length - 1) {
        photoLink = `https://corpus.prozhito.org/pictures/persons/${idAuthor}/preview_140x175.png`
        message += `\n\n #${dateForText}год`

        let PARAM_GROUP = groupPost.slice(1)
        let photoAnswer = await publishImage(photoLink, PARAM_GROUP)

        const form = new FormData()
        form.append('message', message)
        form.append('oauth', 1)
        form.append('owner_id', groupPost)
        if (!photoAnswer.error) {
          form.append(
            'attachments',
            `photo${photoAnswer.response[0].owner_id}_${photoAnswer.response[0].id}`
          )
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

        console.log(`Последняя запись (${indexOfDiary})`)
        clearInterval(idTimer)
      }
      indexOfDiary++
    } else {
      photoLink = `https://corpus.prozhito.org/pictures/persons/${idAuthor}/preview_140x175.png`
      message = `${nameAuthor} (${age} ${ageEnding}) - ${describeAuthor}\n\n${fullDate}\n${text} \n\n #${dateForText}год`

      if (indexOfDiary >= 25) {
        // если запись после 25-ой
        publishDate = 0
      } else {
        if (diariesArray.length > 25) {
          // если количество записей БОЛЬШЕ 25 за день
          publishDate = Math.round(now + (postPeriod / 25) * (indexOfDiary + 1))
        } else {
          // если количество записей МЕНЬШЕ 25 за день
          publishDate = Math.round(
            now + (postPeriod / diariesArray.length) * (indexOfDiary + 1)
          )
        }
      }
      let PARAM_GROUP = groupPost.slice(1)
      let photoAnswer = await publishImage(photoLink, PARAM_GROUP)
      const form = new FormData() // для загрузки фото и длинных данных
      form.append('message', message)
      form.append('oauth', 1)
      form.append('owner_id', groupPost)
      if (!photoAnswer.error) {
        form.append(
          'attachments',
          `photo${photoAnswer.response[0].owner_id}_${photoAnswer.response[0].id}`
        )
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
      console.log(`Опубликована ${indexOfDiary} запись`)

      indexOfDiary++
      message = ''

      // остановка таймера
      if (indexOfDiary >= diariesArray.length) {
        console.log('timer is stop ' + idTimer)
        clearInterval(idTimer)
      }
    } // если запись после 25-ой - конец
  }, 40000)
}

module.exports = { addInVk }

// // cчетчик от 0 до длинны массива
// let message = ''
// // формируем пост
// for (let indexOfDiary = 0; indexOfDiary < diariesArray.length; indexOfDiary++) {
//   if (indexOfDiary >= 47) {   // если запись после 47-ой
//     publishDate = 0
//     message += `${nameAuthor} (${age} лет) - ${describeAuthor}\n${fullDate}\n${text} \n\n ———————————————————————— \n\n`

//   }
//   if ()
// }
