const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

async function publishImage(fileUrl, PARAM_GROUP) {
  const API_ADDRESS = 'https://api.vk.com/method/'
  const METHOD_GET_WALL_SERVER_PHOTO = 'photos.getWallUploadServer'
  const METHOD_SAVE_WALL_PHOTO = 'photos.saveWallPhoto'
  const TOKEN = process.env.VK_ACCESS_TOKEN
  const VERSION = '&v=5.81'

  const LINK_FOR_SERVER_ADDRESS = `${API_ADDRESS}${METHOD_GET_WALL_SERVER_PHOTO}?group_id=${PARAM_GROUP}${VERSION}&access_token=${TOKEN}`

  async function fetchWithRetry(url, options, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await axios(url, options)
        const data = response.data
        return data
      } catch (error) {
        console.error('Error fetching data:', error)
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 15000)) // wait 15 seconds before retrying
        }
      }
    }
    return null
  }

  const data = await fetchWithRetry(LINK_FOR_SERVER_ADDRESS)
  if (!data) {
    console.error('Could not get upload URL after 3 attempts')
    return null
  }

  const uploadUrl = data.response.upload_url

  const imageResponse = await axios.get(fileUrl, {
    responseType: 'arraybuffer',
  })
  const imageBuffer = Buffer.from(imageResponse.data)

  const formData = new FormData()
  formData.append('photo', imageBuffer, 'image.png')

  const uploadResult = await fetchWithRetry(uploadUrl, {
    method: 'post',
    data: formData,
    headers: formData.getHeaders(),
  })
  if (!uploadResult) {
    console.error('Could not save photo after 3 attempts')
    return null
  }

  const LINK_FOR_SAVE_PHOTO = `${API_ADDRESS}${METHOD_SAVE_WALL_PHOTO}?group_id=${PARAM_GROUP}${VERSION}&access_token=${TOKEN}&photo=${uploadResult.photo}&server=${uploadResult.server}&hash=${uploadResult.hash}`

  const answer = await fetchWithRetry(LINK_FOR_SAVE_PHOTO)
  return answer
}

module.exports = publishImage
