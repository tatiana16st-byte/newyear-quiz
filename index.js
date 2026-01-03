const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const rubricsList = require("./data/rubricsList");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let gameState = {
  started: false,
  currentRubric: null,
  currentQuestionIndex: 0,
  players: []
};

io.on("connection", (socket) => {
  console.log("Подключился:", socket.id);

  socket.on("joinGame", (player) => {
    gameState.players.push({ ...player, id: socket.id });
    socket.emit("waiting");
    io.emit("playersUpdate", gameState.players);
  });

  socket.on("adminStart", () => {
    socket.emit("rubricsList", rubricsList);
  });

  socket.on("selectRubric", (rubricId) => {
    const rubric = rubricsList.find(r => r.id === rubricId);
    if (!rubric) return;

    gameState.started = true;
    gameState.currentRubric = require(`./data/rubrics/${rubric.file}`);
    gameState.currentQuestionIndex = 0;

    sendQuestion();
  });

  socket.on("answer", (answer) => {
    // ответы пока просто принимаем
    console.log("Ответ:", answer);
  });

  function sendQuestion() {
    const q = gameState.currentRubric.questions[gameState.currentQuestionIndex];
    if (!q) return;

    io.emit("question", q);
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Сервер запущен");
});
