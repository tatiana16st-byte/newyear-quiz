const socket = io();

const state = document.getElementById('state');
const playersBlock = document.getElementById('players');

function selectRubric(key) {
  socket.emit('select_rubric', key);
  state.textContent = 'Выбрана рубрика: ' + key;
}

function startGame() {
  socket.emit('start_game');
}

function nextQuestion() {
  socket.emit('next_question');
}

socket.on('players_update', (players) => {
  playersBlock.textContent =
    'Игроков: ' + players.length + '\n' +
    players.map(p => p.name).join('\n');
});

socket.on('rubric_selected', (title) => {
  state.textContent = 'Рубрика: ' + title;
});

socket.on('game_started', () => {
  state.textContent = 'Игра запущена';
});

socket.on('game_finished', () => {
  state.textContent = 'Игра завершена';
});
