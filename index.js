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
let usedRubrics = [];
let questionsLeft = [];

/* ===== HELPERS ===== */
function resetGame() {
  gameStarted = false;
  currentRubric = null;
  currentQuestionIndex = 0;
  usedRubrics = [];
  questionsLeft = [];
  players = [];

  io.emit("gameReset");
}

/* ===== SOCKETS ===== */
io.on("connection", (socket) => {
  console.log("Подключился:", socket.id);

  socket.on("joinGame", (player) => {
    if (gameStarted) return;
    players.push({ ...player, id: socket.id });
    socket.emit("waiting");
    io.emit("playersUpdate", players);
  });

  socket.on("adminStart", () => {
    gameStarted = true;

    const availableRubrics = rubricsList.filter(
      (r) => !usedRubrics.includes(r.id)
    );

    socket.emit("rubricsList", availableRubrics);
  });

  socket.on("selectRubric", (rubricId) => {
    const rubricInfo = rubricsList.find((r) => r.id === rubricId);
    if (!rubricInfo) return;

    usedRubrics.push(rubricId);

    currentRubric = require(`./data/rubrics/${rubricInfo.file}`);

    // 🔥 берём 5 случайных вопросов
    questionsLeft = [...currentRubric.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    sendNextQuestion();
  });

  socket.on("answer", () => {
    sendNextQuestion();
  });

  function sendNextQuestion() {
    if (questionsLeft.length === 0) {
      io.emit("rubricFinished");

      const availableRubrics = rubricsList.filter(
        (r) => !usedRubrics.includes(r.id)
      );

      io.emit("rubricsList", availableRubrics);
      return;
    }

    const question = questionsLeft.shift();
    io.emit("question", question);
  }

  socket.on("adminReset", () => {
    resetGame();
  });

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
  });
});

/* ===== START ===== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
