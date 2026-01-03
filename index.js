const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Загружаем ваши данные
const rubricsList = require("./rubricsList");
const rubricsData = {
    1: require("./movies"),
    2: require("./fatherfrost"),
    3: require("./traditions"),
    4: require("./tree")
};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "client.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));

let players = {}; 
let gameState = {
    status: "SELECT_MODE",
    gameMode: "team", // 'team' или 'single'
    maxPlayers: 4,
    currentRubric: null,
    currentQuestionIndex: 0,
    answers: {},
    timer: 30
};

io.on("connection", (socket) => {
    socket.emit("gameState", getPublicState());

    // Админ: Выбор режима
    socket.on("admin_set_mode", (mode) => {
        gameState.gameMode = mode;
        gameState.maxPlayers = (mode === "team") ? 4 : 8;
        gameState.status = "REGISTRATION";
        players = {}; 
        io.emit("gameState", getPublicState());
    });

    // Игрок: Регистрация
    socket.on("joinGame", (data) => {
        if (Object.keys(players).length < gameState.maxPlayers) {
            players[socket.id] = { 
                name: data.name, 
                avatar: data.avatar, 
                score: 0, 
                hasAnswered: false 
            };
            socket.emit("join_success");
        } else {
            socket.emit("error", "Мест нет!");
        }
        io.emit("gameState", getPublicState());
    });

    // Админ: Старт и выбор рубрики
    socket.on("selectRubric", (id) => {
        gameState.currentRubric = rubricsData[id];
        gameState.currentQuestionIndex = 0;
        startQuestion();
    });

    socket.on("submitAnswer", (answerKey) => {
        if (players[socket.id] && !players[socket.id].hasAnswered) {
            gameState.answers[socket.id] = answerKey;
            players[socket.id].hasAnswered = true;
            io.emit("gameState", getPublicState());
        }
    });

    socket.on("admin_next", () => {
        if (gameState.status === "QUESTION") {
            showResult();
        } else {
            nextQuestion();
        }
    });
});

function startQuestion() {
    gameState.status = "QUESTION";
    gameState.timer = 30;
    gameState.answers = {};
    Object.values(players).forEach(p => p.hasAnswered = false);
    io.emit("gameState", getPublicState());
}

function showResult() {
    const q = gameState.currentRubric.questions[gameState.currentQuestionIndex];
    Object.keys(gameState.answers).forEach(id => {
        if (gameState.answers[id] === q.correctAnswer) {
            players[id].score += 1;
        }
    });
    gameState.status = "RESULT";
    io.emit("reveal_answer", { correct: q.correctAnswer, text: q.correctText });
    io.emit("gameState", getPublicState());
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex >= 5) { // По 5 вопросов на раунд
        gameState.status = "LOBBY"; 
    } else {
        startQuestion();
    }
    io.emit("gameState", getPublicState());
}

function getPublicState() {
    const q = gameState.currentRubric ? gameState.currentRubric.questions[gameState.currentQuestionIndex] : null;
    return {
        ...gameState,
        players: Object.values(players),
        question: q ? { text: q.question, options: q.options, image: q.imagePath } : null
    };
}

server.listen(3000, () => console.log("🚀 Server at http://localhost:3000"));
