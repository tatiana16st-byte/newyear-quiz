const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

/* ================= STATIC ================= */

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

/* ================= DATA ================= */

const rubricsList = require('./data/rubricsList');

/* ================= GAME STATE ================= */

let players = [];
let gameStarted = false;

let currentGame = {
  rubricId: null,
  rubricTitle: '',
  questions: [],
  currentQuestionIndex: 0
};

/* ================= SOCKET ================= */

io.on('connection', (socket) => {

  // отправляем список рубрик админу
  socket.emit('rubrics_list', rubricsList);

  socket.on('register_player', (data) => {
    if (gameStarted) return;

    const player = {
      id: socket.id,
      name: data.name,
      avatar: data.avatar
    };

    players.push(player);
    io.emit('lobby_update', players);
  });

  socket.on('start_game', () => {
    gameStarted = true;
    io.emit('game_started');
  });

  socket.on('select_rubric', (rubricId) => {
    const rubric = rubricsList.find(r => r.id === rubricId);
    if (!rubric) return;

    const rubricData = require(rubric.file);

    currentGame.rubricId = rubric.id;
    currentGame.rubricTitle = rubric.title;
    currentGame.questions = rubricData.questions;
    currentGame.currentQuestionIndex = 0;

    io.emit('rubric_selected', {
      title: rubric.title
    });
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('lobby_update', players);
  });
});

/* ================= START ================= */

server.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
