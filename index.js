const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ================= PORT ================= */

// ⚠️ ВАЖНО: Railway / Heroku / Render
const PORT = process.env.PORT || 3000;

/* ================= STATIC ================= */

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

/* ================= SOCKET ================= */

io.on('connection', (socket) => {
  console.log('🔌 Подключился клиент:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Отключился клиент:', socket.id);
  });
});

/* ================= START ================= */

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
