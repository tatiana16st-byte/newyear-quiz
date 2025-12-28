// game-data-loader.js

const path = require('path');

const dataPath = path.join(__dirname, 'public', 'data', 'rubrics');

const rubricTraditions = require(path.join(dataPath, 'traditions.js'));
const rubricMovies = require(path.join(dataPath, 'movies.js'));
const rubricFatherFrost = require(path.join(dataPath, 'fatherfrost.js'));
const rubricTree = require(path.join(dataPath, 'tree.js'));

const allRubrics = [
    rubricTraditions,
    rubricMovies,
    rubricFatherFrost,
    rubricTree
];

function getNewGameSet() {
    return allRubrics.map(rubric => ({
        rubricId: rubric.rubricId,
        rubricTitle: rubric.rubricTitle,
        questions: rubric.questions.slice(0, 5)
    }));
}

module.exports = { getNewGameSet };
