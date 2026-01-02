const path = require('path');

let movies, fatherfrost, traditions, tree;

try {
  const baseDir = path.join(__dirname, '../../data/rubrics');

  movies = require(path.join(baseDir, 'movies'));
  fatherfrost = require(path.join(baseDir, 'fatherfrost'));
  traditions = require(path.join(baseDir, 'traditions'));
  tree = require(path.join(baseDir, 'tree'));

} catch (e) {
  console.error("!!! КРИТИЧЕСКАЯ ОШИБКА: Файлы рубрик не найдены по пути /data/rubrics/");
  console.error("Попробуйте проверить, не заглавными ли буквами названы файлы в GitHub.");
  console.error("Ошибка:", e.message);
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
