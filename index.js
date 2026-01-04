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
let usedRubrics = [];
let currentQuestions = [];
let currentQuestionIndex = 0;

/* ===== HELPERS ===== */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* ===== SOCKETS ===== */
io.on("connection", (socket) => {
  console.log("Подключился:", socket.id);

  /* ===== PLAYER ===== */
  socket.on("joinGame", (player) => {
    players.push({ ...player, id: socket.id });
    socket.emit("waiting");
    io.emit("playersUpdate", players);
  });

  /* ===== ADMIN START ===== */
  socket.on("adminStart", () => {
    const availableRubrics = rubricsList.filter(
      (r) => !usedRubrics.includes(r.id)
    );
    socket.emit("rubricsList", availableRubrics);
  });

  /* ===== SELECT RUBRIC ===== */
  socket.on("selectRubric", (rubricId) => {
    const rubricInfo = rubricsList.find((r) => r.id === rubricId);
    if (!rubricInfo) return;

    const rubricData = require(`./data/rubrics/${rubricInfo.file}`);

    // берём 5 случайных вопросов
    currentQuestions = shuffle([...rubricData.questions]).slice(0, 5);
    currentQuestionIndex = 0;

    usedRubrics.push(rubricId);

    sendQuestion();
  });

  /* ===== ANSWER ===== */
  socket.on("answer", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {
      sendQuestion();
    } else {
      io.emit("rubricFinished");
    }
  });

  /* ===== SEND QUESTION ===== */
  function sendQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    if (!q) return;

    io.emit("question", q);
  }

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
  });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
