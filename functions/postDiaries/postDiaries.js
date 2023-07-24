const { addInVk } = require('./addInVk')

async function postDiaries(req) {
 
  const todayDate = req.body.todayDate //!!! todayDate = поле name в input=Date
  let now = new Date()
  now = Math.round(now.getTime() / 1000) // время сейчас в миллисекундах
  const addTime = req.body.addTime // количество прибавляемых часов:
  const postPeriod = +addTime * 3600 // время которое нужно будет разделить на количество постов

  const group1900 = 195767555
  const group1920 = 154256057
  const group1940 = 192811727
  const groupTest = 166105909

  // запуск функции
  try {
    addInVk(todayDate, group1900, postPeriod, now) 
    addInVk(todayDate, group1920, postPeriod, now)
    addInVk(todayDate, group1940, postPeriod, now)
    // addInVk(todayDate, groupTest, postPeriod, now)
  } catch (err) {
    console.log('err', err)
  }
}

module.exports = { postDiaries }
