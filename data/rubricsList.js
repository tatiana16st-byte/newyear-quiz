/**
 * Главный файл конфигурации рубрик (rubricsList.js)
 * Путь к файлу в проекте: /src/data/rubricsList.js
 * Файлы вопросов находятся в: /data/rubrics/ (в корне проекта)
 */

const path = require('path');
const fs = require('fs');

let moviesData, fatherfrostData, traditionsData, treeData;

// Определяем базовый путь к папке с рубриками
// Проверяем сначала корень проекта (на два уровня выше от src/data)
let baseDir = path.join(__dirname, '../../data/rubrics');

// Если вдруг папка data лежит внутри src, проверяем и этот путь
if (!fs.existsSync(baseDir)) {
  baseDir = path.join(__dirname, './rubrics');
}

try {
  moviesData = require(path.join(baseDir, 'movies'));
  fatherfrostData = require(path.join(baseDir, 'fatherfrost'));
  traditionsData = require(path.join(baseDir, 'traditions'));
  treeData = require(path.join(baseDir, 'tree'));
} catch (e) {
  console.error("!!! КРИТИЧЕСКАЯ ОШИБКА: Файлы рубрик не найдены.");
  console.error("Искали в: " + baseDir);
  console.error("Ошибка:", e.message);
  throw e;
}

/**
 * Функция для извлечения массива вопросов.
 * Ваши файлы экспортируют объект { questions: [...] }, 
 * поэтому мы достаем именно поле questions.
 */
const extractQuestions = (moduleExport) => {
  if (moduleExport && moduleExport.questions) return moduleExport.questions;
  if (Array.isArray(moduleExport)) return moduleExport;
  return [];
};

const rubricsList = [
  {
    id: 1,
    title: 'Новогодние мультфильмы и фильмы',
    rubricId: 'movies',
    questions: extractQuestions(moviesData)
  },
  {
    id: 2,
    title: 'Дед Мороз',
    rubricId: 'fatherfrost',
    questions: extractQuestions(fatherfrostData)
  },
  {
    id: 3,
    title: 'Новогодние традиции',
    rubricId: 'traditions',
    questions: extractQuestions(traditionsData)
  },
  {
    id: 4,
    title: 'Новогодняя ёлка',
    rubricId: 'tree',
    questions: extractQuestions(treeData)
  }
];

if (typeof module !== 'undefined') {
  module.exports = rubricsList;
}
