const game = require("./game");
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

/* ===== SOCKETS ===== */
io.on("connection", (socket) => {
  console.log("Подключился:", socket.id);

  /* ===== PLAYER JOIN ===== */
  socket.on("joinGame", (player) => {
    players.push({ ...player, id: socket.id });
    socket.emit("waiting");
    io.emit("playersUpdate", players);
  });

  /* ===== ADMIN START ===== */
  socket.on("adminStart", () => {
    gameStarted = true;

    // 🔥 ВАЖНО: сообщаем ВСЕМ игрокам, что игра началась
    io.emit("game_started");

    // отправляем список рубрик ТОЛЬКО админу
    socket.emit("rubricsList", rubricsList);
  });

  /* ===== SELECT RUBRIC ===== */
socket.on("selectRubric", (rubricId) => {
  const rubricInfo = rubricsList.find(r => r.id === rubricId);
  if (!rubricInfo) return;

  const rubricData = require(`./data/rubrics/${rubricInfo.file}`);

  game.startGame(rubricData.questions);

  io.emit("question", game.getCurrentQuestion());
});

  /* ===== SEND QUESTION ===== */
  function sendQuestion() {
    if (!currentRubric) return;

    const question = currentRubric.questions[currentQuestionIndex];
    if (!question) return;

    console.log("Отправляем вопрос:", question.question);

    // 🔥 ВАЖНО: отправляем вопрос ВСЕМ игрокам
    io.emit("question", question);
  }

  socket.on("disconnect", () => {
    players = players.filter(p => p.id !== socket.id);
  });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

socket.on("answer", (data) => {
  const next = game.submitAnswer();

  if (!next) {
    io.emit("gameFinished");
    return;
  }

  io.emit("question", next);
});



