const socket = io();

const state = document.getElementById('state');
const startBtn = document.getElementById('startBtn');

startBtn.onclick = () => {
  socket.emit('start_game');
};

socket.on('lobby_update', (players) => {
  state.textContent =
    'Игроков: ' + players.length + '\n' +
    players.map(p => p.name).join('\n');
});

socket.on('game_started', () => {
  state.textContent += '\n\n▶️ Игра запущена';
});
