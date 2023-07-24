async function fetchDiaries(req, res) {
  res.render('index', { title: 'Diary' });
}



module.exports = {
  fetchDiaries,
};
