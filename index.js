const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const rubricsList = require("./data/rubricsList");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ===== STATIC ===== */
app.use(express.static(path.join(__dirname, "public")));

/* ===== ROUTES ===== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "client.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

/* ===== GAME STATE ===== */
let players = [];
let gameStarted = false;
let currentRubric = null;
let currentQuestionIndex = 0;

/* ===== SOCKETS ===== */
io.on("connection", (socket) => {
  console.log("Подключился:", socket.id);

  // 👤 Игрок подключился
  socket.on("joinGame", (player) => {
    players.push({ ...player, id: socket.id });

    socket.emit("waiting");
    io.emit("playersUpdate", players);

    console.log("Игрок:", player.name);
  });

  // 👑 Админ нажал «Старт игры»
  socket.on("adminStart", () => {
    console.log("Игра запущена админом");

    gameStarted = true;

    // 🔥 СООБЩАЕМ ВСЕМ ИГРОКАМ
    io.emit("game_started");

    // 📦 Отправляем рубрики админу
    io.emit("rubricsList", rubricsList);
  });

  // 📚 Выбор рубрики
  socket.on("selectRubric", (rubricId) => {
    const rubricInfo = rubricsList.find(r => r.id === rubricId);
    if (!rubricInfo) return;

    currentRubric = require(`./data/rubrics/${rubricInfo.file}`);
    currentQuestionIndex = 0;

    sendQuestion();
  });

  // ❓ Отправка вопроса
  function sendQuestion() {
    if (!currentRubric) return;

    const q = currentRubric.questions[currentQuestionIndex];
    if (!q) return;

    io.emit("question", q);
  }

  socket.on("disconnect", () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit("playersUpdate", players);
  });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
