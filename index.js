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
let currentRubric = null;
let questions = [];
let currentQuestionIndex = 0;
let gameStarted = false;

/* ===== SOCKETS ===== */
io.on("connection", (socket) => {
  console.log("Подключился:", socket.id);

  socket.on("joinGame", (player) => {
    players.push({ ...player, id: socket.id });
    socket.emit("waiting");
  });

  socket.on("adminStart", () => {
    gameStarted = true;

    const availableRubrics = rubricsList.filter(
      r => !usedRubrics.includes(r.id)
    );

    socket.emit("rubricsList", availableRubrics);
  });

  socket.on("selectRubric", (rubricId) => {
    const rubricInfo = rubricsList.find(r => r.id === rubricId);
    if (!rubricInfo) return;

    usedRubrics.push(rubricId);

    const rubricData = require(`./data/rubrics/${rubricInfo.file}`);
    questions = shuffle(rubricData.questions).slice(0, 5);
    currentQuestionIndex = 0;
    currentRubric = rubricId;

    sendQuestion();
  });

  socket.on("answer", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
      io.emit("quizFinished", {
        rubricId: currentRubric
      });
      currentRubric = null;
      questions = [];
      return;
    }

    sendQuestion();
  });

  socket.on("adminReset", () => {
    players = [];
    usedRubrics = [];
    currentRubric = null;
    questions = [];
    currentQuestionIndex = 0;
    gameStarted = false;

    io.emit("gameReset");
  });

  socket.on("disconnect", () => {
    players = players.filter(p => p.id !== socket.id);
  });

  function sendQuestion() {
    const q = questions[currentQuestionIndex];
    io.emit("question", q);
  }
});

/* ===== HELPERS ===== */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
