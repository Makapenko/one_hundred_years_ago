function subtractOneDay(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  const result = date.toISOString().split('T')[0];
  return result;
}

module.exports = { subtractOneDay }
