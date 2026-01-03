const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Загружаем список рубрик
const rubricsList = require("./data/rubricsList");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let players = {}; 
let gameState = {
    status: "REGISTRATION", // SELECT_MODE, REGISTRATION, QUESTION, RESULT
    currentRubric: null,
    currentQuestionIndex: 0,
    answers: {},
    timer: 30
};

// Соответствие ID рубрики и файла
const rubricFiles = {
    1: "movies",
    2: "fatherfrost",
    3: "traditions",
    4: "tree"
};

io.on("connection", (socket) => {
    socket.emit("gameState", getPublicState());

    // Регистрация игрока
    socket.on("joinGame", (data) => {
        players[socket.id] = { 
            name: data.name, 
            avatar: data.avatar, 
            score: 0, 
            hasAnswered: false 
        };
        io.emit("gameState", getPublicState());
    });

    // Админ: Выбор рубрики
    socket.on("selectRubric", (id) => {
        const fileName = rubricFiles[id];
        gameState.currentRubric = require(`./data/rubrics/${fileName}`);
        gameState.currentQuestionIndex = 0;
        startQuestion();
    });

    // Игрок: Отправка ответа
    socket.on("submitAnswer", (answerKey) => {
        if (players[socket.id] && !players[socket.id].hasAnswered) {
            gameState.answers[socket.id] = answerKey;
            players[socket.id].hasAnswered = true;
            io.emit("gameState", getPublicState());
        }
    });

    // Админ: Следующий шаг
    socket.on("admin_next", () => {
        if (gameState.status === "QUESTION") showResult();
        else nextQuestion();
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
        if (gameState.answers[id] === q.correctAnswer) players[id].score += 1;
    });
    gameState.status = "RESULT";
    io.emit("reveal_answer", { correct: q.correctAnswer, text: q.correctText });
    io.emit("gameState", getPublicState());
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex >= 5) gameState.status = "REGISTRATION"; // Конец раунда
    else startQuestion();
}

function getPublicState() {
    const q = gameState.currentRubric ? gameState.currentRubric.questions[gameState.currentQuestionIndex] : null;
    return {
        ...gameState,
        players: Object.values(players),
        question: q ? { text: q.question, options: q.options, image: q.imagePath } : null,
        rubricsList: rubricsList
    };
}

server.listen(3000, () => console.log("🎄 Викторина запущена: http://localhost:3000"));
