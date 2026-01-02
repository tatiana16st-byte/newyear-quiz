const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const rubricsList = require('./data/rubricsList');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 3000;

/* ================= STATIC ================= */
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'client.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

/* ================= GAME STATE ================= */
let players = [];
let gameStarted = false;
let currentRubric = null;
let currentQuestionIndex = 0;

/* ================= SOCKET ================= */
io.on('connection', (socket) => {
  console.log('🔌 Подключился:', socket.id);

  socket.on('register_player', (data) => {
    if (gameStarted) return;
    players.push({ id: socket.id, name: data.name, avatar: data.avatar });
    io.emit('lobby_update', players);
  });

  socket.on('start_game', (rubricId) => {
    if (gameStarted) return;
    currentRubric = rubricsList.find(r => r.rubricId === rubricId);
    if (!currentRubric) return;
    gameStarted = true;
    currentQuestionIndex = 0;
    io.emit('game_started');
    sendQuestion();
  });

  socket.on('player_answer', (data) => {
    console.log(`${data.name} ответил ${data.answer}`);
    // Можно добавить обработку очков
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('lobby_update', players);
  });
});

/* ================= GAME LOGIC ================= */
function sendQuestion() {
  if (!currentRubric) return;
  const question = currentRubric.questions[currentQuestionIndex];
  if (!question) return;
  io.emit('new_question', question);
  currentQuestionIndex++;
}

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
