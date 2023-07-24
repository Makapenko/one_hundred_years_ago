function getAgeEnding(age) {
  const mod100 = age % 100
  if (mod100 >= 11 && mod100 <= 14) {
    return 'лет'
  }

  const mod10 = age % 10
  switch (mod10) {
    case 1:
      return 'год'
    case 2:
    case 3:
    case 4:
      return 'года'
    default:
      return 'лет'
  }
}

module.exports = { getAgeEnding }
