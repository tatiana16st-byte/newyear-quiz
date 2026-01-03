// game.js
let gameState = {
  started: false,
  rubric: null,
  questions: [],
  currentQuestionIndex: 0,
};

function startGame(questions) {
  gameState.started = true;
  gameState.questions = questions;
  gameState.currentQuestionIndex = 0;
}

function getCurrentQuestion() {
  return gameState.questions[gameState.currentQuestionIndex];
}

function submitAnswer() {
  gameState.currentQuestionIndex++;

  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    return null;
  }

  return getCurrentQuestion();
}

function resetGame() {
  gameState = {
    started: false,
    rubric: null,
    questions: [],
    currentQuestionIndex: 0,
  };
}

module.exports = {
  startGame,
  getCurrentQuestion,
  submitAnswer,
  resetGame,
};
