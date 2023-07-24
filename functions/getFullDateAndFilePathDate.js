async function getFullDateAndFilePathDate(groupPost, halfDate) {
  let fullDate = ''
  let filePathDate = ''

  if (groupPost == '-195767555') {
    fullDate = 190 + halfDate
    filePathDate = 1900
  } else if (groupPost == '-154256057') {
    fullDate = 192 + halfDate
    filePathDate = 1920
  } else if (groupPost == '-192811727') {
    fullDate = 194 + halfDate
    filePathDate = 1940
  } else if (groupPost == '-166105909') { // для теста
    fullDate = 192 + halfDate
    filePathDate = 1920
  }

  return { fullDate, filePathDate }
}

module.exports = { getFullDateAndFilePathDate }
