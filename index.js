const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.static('public'));

/* ================= RUBRICS ================= */

const movies = require('./data/rubrics/movies');
const fatherfrost = require('./data/rubrics/fatherfrost');
const traditions = require('./data/rubrics/traditions');
const tree = require('./data/rubrics/tree');

const rubrics = {
  movies,
  fatherfrost,
  traditions,
  tree
};

/* ================= GAME STATE ================= */

let players = [];
let gameStarted = false;
let currentRubric = null;
let currentQuestionIndex = 0;

/* ================= SOCKET ================= */

io.on('connection', (socket) => {
  console.log('Подключён:', socket.id);

  socket.on('join_game', ({ name, avatar }) => {
    const player = { id: socket.id, name, avatar };
    players.push(player);

    io.emit('players_update', players);
  });

  socket.on('select_rubric', (rubricKey) => {
    currentRubric = rubrics[rubricKey];
    currentQuestionIndex = 0;

    io.emit('rubric_selected', currentRubric.rubricTitle);
    console.log('Выбрана рубрика:', rubricKey);
  });

  socket.on('start_game', () => {
    if (!currentRubric) return;

    gameStarted = true;
    currentQuestionIndex = 0;

    const q = currentRubric.questions[currentQuestionIndex];

    io.emit('game_started');
    io.emit('new_question', {
      rubricTitle: currentRubric.rubricTitle,
      question: q.question,
      options: q.options,
      imagePath: q.imagePath
    });
  });

  socket.on('next_question', () => {
    currentQuestionIndex++;

    if (currentQuestionIndex >= currentRubric.questions.length) {
      io.emit('game_finished');
      return;
    }

    const q = currentRubric.questions[currentQuestionIndex];

    io.emit('new_question', {
      rubricTitle: currentRubric.rubricTitle,
      question: q.question,
      options: q.options,
      imagePath: q.imagePath
    });
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('players_update', players);
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Сервер запущен на порту', PORT);
});
