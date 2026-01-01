const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// ✅ CORS для телефонов и Render
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

/* ================= GAME STATE ================= */

let players = [];
let gameStarted = false;

/* ================= SOCKET ================= */

io.on('connection', (socket) => {
  console.log('🔌 Подключился:', socket.id);

  socket.on('register_player', (data) => {
    if (players.length >= 8) return;

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

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('lobby_update', players);
  });
});

/* ================= START ================= */

server.listen(PORT, () => {
  console.log(🚀 Сервер запущен на порту ${PORT});
});
