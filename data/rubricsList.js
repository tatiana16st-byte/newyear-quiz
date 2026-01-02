let movies, fatherfrost, traditions, tree;

try {
  movies = require('movies');
  fatherfrost = require('fatherfrost');
  traditions = require('traditions');
  tree = require('tree');
} catch (e) {
  console.error("ОШИБКА ЗАГРУЗКИ ФАЙЛОВ ВОПРОСОВ. Проверьте пути в require().");
  console.error("Текущая ошибка:", e.message);
  // Выбрасываем ошибку дальше, чтобы Render показал, какого именно файла не хватает
  throw e;
}

module.exports = [
  {
    id: 1,
    title: 'Новогодние мультфильмы и фильмы',
    rubricId: 'movies',
    data: movies
  },
  {
    id: 2,
    title: 'Дед Мороз',
    rubricId: 'fatherfrost',
    data: fatherfrost
  },
  {
    id: 3,
    title: 'Новогодние традиции',
    rubricId: 'traditions',
    data: traditions
  },
  {
    id: 4,
    title: 'Новогодняя ёлка',
    rubricId: 'tree',
    data: tree
  }
];
