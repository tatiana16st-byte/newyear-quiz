/**
 * Главный файл конфигурации рубрик викторины.
 * Ссылается на отдельные файлы с вопросами.
 */

const movies = require('./movies');
const fatherfrost = require('./fatherfrost');
const traditions = require('./traditions');
const tree = require('./tree');

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
