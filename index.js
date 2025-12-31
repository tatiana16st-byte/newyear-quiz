const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

/* ================= GAME STATE ================= */

let players = [];

/* ================= SOCKET ================= */

io.on('connection', socket => {
  console.log('🔌 Подключился:', socket.id);

  socket.on('register_player', data => {
    const player = {
      id: socket.id,
      mode: data.mode,
      avatar: data.avatar,
      playerName: data.playerName,
      teamName: data.teamName || null
    };

    players.push(player);
    io.emit('lobby_update', players);
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('lobby_update', players);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
