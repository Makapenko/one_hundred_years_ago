const { addNewsVk } = require('./addNewsVk')

async function postNewspaper(req) {
  
  const todayDate = req.body.todayDate //!!! todayDate = поле name в input=Date
  let now = new Date()
  now = Math.round(now.getTime() / 1000) // время сейчас в миллисекундах
  const addTime = req.body.addTime // количество прибавляемых часов:
  const postPeriod = +addTime * 3600 // время которое нужно будет разделить на количество постов

  const group1900 = 195767555
  const group1920 = 154256057
  const groupTest = 166105909

  // запуск функции
  try {
    addNewsVk(todayDate, group1900, postPeriod, now) 
    addNewsVk(todayDate, group1920, postPeriod, now)
    // addNewsVk(todayDate, groupTest, postPeriod, now)
  } catch (err) {
    console.log('err', err)
  }
}

module.exports = { postNewspaper }
