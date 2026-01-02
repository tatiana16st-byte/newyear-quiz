/**
 * Главный файл конфигурации рубрик (rubricsList.js)
 * Путь к файлу: /src/data/rubricsList.js
 * Файлы вопросов находятся в: /data/rubrics/ (в корне проекта)
 */

const path = require('path');

let movies, fatherfrost, traditions, tree;

try {
  /**
   * Разбор путей:
   * __dirname — это /opt/render/project/src/data/
   * '..' — это /opt/render/project/src/
   * '../..' — это /opt/render/project/ (корень проекта)
   */
  movies = require(path.join(__dirname, '../../../data/rubrics/movies'));
  fatherfrost = require(path.join(__dirname, '../../../data/rubrics/fatherfrost'));
  traditions = require(path.join(__dirname, '../../../data/rubrics/traditions'));
  tree = require(path.join(__dirname, '../../../data/rubrics/tree'));
} catch (e) {
  console.error("!!! КРИТИЧЕСКАЯ ОШИБКА: Модули не найдены по пути /data/rubrics/");
  console.error("Попытка загрузки через относительный путь ../../../data/rubrics/");
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
