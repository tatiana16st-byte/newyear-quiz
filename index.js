const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const rubricsList = require("./data/rubricsList");
const game = require("./game");

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

/* ===== SOCKETS ===== */
io.on("connection", (socket) => {
  console.log("Подключился:", socket.id);

  /* ===== ИГРОК ===== */
  socket.on("joinGame", (player) => {
    socket.emit("waiting");
  });

  /* ===== АДМИН ===== */
  socket.on("adminStart", () => {
    socket.emit("rubricsList", rubricsList);
  });

  socket.on("selectRubric", (rubricId) => {
    const rubricInfo = rubricsList.find(r => r.id === rubricId);
    if (!rubricInfo) return;

    const rubricData = require(`./data/rubrics/${rubricInfo.file}`);

    game.startGame(rubricData.questions);

    io.emit("question", game.getCurrentQuestion());
  });

  /* ===== ОТВЕТ ===== */
  socket.on("answer", () => {
    const nextQuestion = game.submitAnswer();

    if (!nextQuestion) {
      io.emit("gameFinished");
      return;
    }

    io.emit("question", nextQuestion);
  });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
