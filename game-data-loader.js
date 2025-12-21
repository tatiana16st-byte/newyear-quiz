// game-data-loader.js - ИСПРАВЛЕННЫЕ ПУТИ

// Указываем ТОЧНЫЙ путь к папке с рубриками, согласно скриншоту: public/data/rubrics/
const dataPath = './public/data/rubrics/';

// 1. Импортируем данные из каждого файла-рубрики.
// !!! Убедитесь, что внутри этих файлов есть "module.exports =" !!!
const rubricTraditions = require(dataPath + 'traditions.js');
const rubricMovies = require(dataPath + 'movies.js');
const rubricFatherFrost = require(dataPath + 'fatherfrost.js');
const rubricTree = require(dataPath + 'tree.js');

// 2. Создаем массив, содержащий все рубрики.
const allRubrics = [
    rubricTraditions, 
    rubricMovies, 
    rubricFatherFrost, 
    rubricTree
];


// 3. Функция, которая подготавливает набор из 20 вопросов для старта игры
function getNewGameSet() {
    
    // Мы берем каждую рубрику из нашего массива allRubrics и...
    const gameSet = allRubrics.map(rubric => ({
        // Новые имена ключей из рубрик
        rubricId: rubric.rubricId,
        rubricTitle: rubric.rubricTitle,
        // ... и выбираем только ПЕРВЫЕ 5 вопросов из этой рубрики
        questions: rubric.questions.slice(0, 5) 
    }));
    
    return gameSet;
}


// 4. Экспортируем функцию, чтобы ее можно было вызвать из index.js
module.exports = {
    getNewGameSet     
};