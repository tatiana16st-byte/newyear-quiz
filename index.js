io.on('connection', (socket) => {
  console.log('Подключился:', socket.id);

  socket.on('register_player', (player) => {
    players[socket.id] = player;
    console.log('Игрок зарегистрирован:', player.name);
  });

  socket.on('start_game', () => {
    console.log('Игра запущена админом');

    gameStarted = true;

    // 🔥 ВАЖНО — отправляем ВСЕМ игрокам
    io.emit('game_started');

    // отправляем рубрики админу
    io.emit('rubrics_list', rubricsList);
  });

  socket.on('select_rubric', (rubricId) => {
    currentRubric = rubricId;
    currentQuestionIndex = 0;

    const question = getQuestion();
    io.emit('question', question);
  });

  socket.on('answer', (answer) => {
    console.log('Ответ игрока:', answer);
  });
});

