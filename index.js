const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(express.static('public'));

/* ================= RUBRICS ================= */

const movies = require('./data/rubrics/movies');
const fatherfrost = require('./data/rubrics/fatherfrost');
const traditions = require('./data/rubrics/traditions');
const tree = require('./data/rubrics/tree');

const rubrics = { movies, fatherfrost, traditions, tree };

/* ================= GAME STATE ================= */

let players = [];
let currentRubric = null;
let currentQuestionIndex = 0;
let answers = {};

/* ================= SOCKET ================= */

io.on('connection', (socket) => {

  socket.on('join_game', ({ name, avatar }) => {
    players.push({
      id: socket.id,
      name,
      avatar,
      score: 0
    });
    io.emit('players_update', players);
  });

  socket.on('select_rubric', (key) => {
    currentRubric = rubrics[key];
    currentQuestionIndex = 0;
    io.emit('rubric_selected', currentRubric.rubricTitle);
  });

  socket.on('start_game', () => {
    sendQuestion();
  });

  socket.on('submit_answer', (answer) => {
    if (answers[socket.id]) return; // защита от повторного ответа

    answers[socket.id] = answer;

    const q = currentRubric.questions[currentQuestionIndex];
    const correct = q.correctAnswer === answer;

    if (correct) {
      const player = players.find(p => p.id === socket.id);
      if (player) player.score += 1;
    }

    socket.emit('answer_result', {
      correct,
      correctAnswer: q.correctAnswer,
      correctText: q.correctText
    });
  });

  socket.on('next_question', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex >= currentRubric.questions.length) {
      io.emit('game_finished', players);
      return;
    }
    sendQuestion();
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('players_update', players);
  });

  function sendQuestion() {
    answers = {};
    const q = currentRubric.questions[currentQuestionIndex];

    io.emit('new_question', {
      rubricTitle: currentRubric.rubricTitle,
      question: q.question,
      options: q.options,
      imagePath: q.imagePath
    });
  }
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server started on', PORT));
