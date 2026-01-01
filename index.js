<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Админ — Викторина</title>
</head>
<body>

<h1>🎤 АДМИН ПАНЕЛЬ</h1>

<button onclick="start()">▶️ СТАРТ ИГРЫ</button>
<button onclick="end()">⛔️ ЗАВЕРШИТЬ</button>

<h3>Состояние:</h3>
<pre id="state">Ожидание игроков...</pre>

<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
  const state = document.getElementById('state');

  function start() {
    socket.emit('start_game');
    state.textContent = 'Игра запущена';
  }

  function end() {
    socket.emit('end_game');
    state.textContent = 'Игра завершена';
  }

  socket.on('lobby_update', (players) => {
    state.textContent =
      'Игроков: ' + players.length + '\n' +
      players.map(p => p.name).join('\n');
  });
</script>

</body>
</html>
