/**
 * Главный файл конфигурации рубрик (rubricsList.js)
 * Путь к файлу в проекте: /src/data/rubricsList.js
 * Файлы вопросов находятся в: /data/rubrics/ (в корне проекта)
 */

const path = require('path');
const fs = require('fs');

let moviesData, fatherfrostData, traditionsData, treeData;

/**
 * Пытаемся определить корректный путь к папке data.
 * На Render структура обычно такая: /opt/render/project/src/
 * Значит папка data в корне будет на два уровня выше от этого файла.
 */
const rootDir = path.resolve(__dirname, '../../'); 
const baseDir = path.join(rootDir, 'data', 'rubrics');

console.log("Попытка загрузки рубрик из: " + baseDir);

try {
  // Проверяем существование папки перед загрузкой
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Директория ${baseDir} не найдена`);
  }

  // Загружаем данные
  moviesData = require(path.join(baseDir, 'movies'));
  fatherfrostData = require(path.join(baseDir, 'fatherfrost'));
  traditionsData = require(path.join(baseDir, 'traditions'));
  treeData = require(path.join(baseDir, 'tree'));
  
  console.log("✅ Все файлы рубрик успешно найдены и загружены.");
} catch (e) {
  console.error("❌ ОШИБКА ЗАГРУЗКИ:");
  console.error("Путь:", baseDir);
  console.error("Текст ошибки:", e.message);
  
  // Чтобы сервер не падал, если файлы не найдены, создадим пустые заглушки
  moviesData = { questions: [] };
  fatherfrostData = { questions: [] };
  traditionsData = { questions: [] };
  treeData = { questions: [] };
}

/**
 * Функция для извлечения массива вопросов.
 */
const extractQuestions = (moduleExport, title) => {
  let q = [];
  if (moduleExport && moduleExport.questions) {
    q = moduleExport.questions;
  } else if (Array.isArray(moduleExport)) {
    q = moduleExport;
  }
  console.log(`📊 Рубрика "${title}": загружено ${q.length} вопросов.`);
  return q;
};

const rubricsList = [
  {
    id: 1,
    title: 'Новогодние мультфильмы и фильмы',
    rubricId: 'movies',
    questions: extractQuestions(moviesData, 'Фильмы')
  },
  {
    id: 2,
    title: 'Дед Мороз',
    rubricId: 'fatherfrost',
    questions: extractQuestions(fatherfrostData, 'Дед Мороз')
  },
  {
    id: 3,
    title: 'Новогодние традиции',
    rubricId: 'traditions',
    questions: extractQuestions(traditionsData, 'Традиции')
  },
  {
    id: 4,
    title: 'Новогодняя ёлка',
    rubricId: 'tree',
    questions: extractQuestions(treeData, 'Ёлка')
  }
];

if (typeof module !== 'undefined') {
  module.exports = rubricsList;
}
