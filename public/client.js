const socket = io();

let mode = null;
let avatar = null;

/* ================= MODE ================= */

function selectMode(selectedMode) {
  mode = selectedMode;
  document.getElementById('mode-screen').style.display = 'none';
  document.getElementById('avatar-screen').style.display = 'block';
  loadAvatars();
}

/* ================= AVATARS ================= */

function loadAvatars() {
  const container = document.getElementById('avatars');
  container.innerHTML = '';

  const path = mode === 'solo'
    ? '/images/avatars/solo/'
    : '/images/avatars/teams/';

  for (let i = 1; i <= 8; i++) {
    const img = document.createElement('img');
    img.src = `${path}avatar${i}.png`;
    img.className = 'avatar';
    img.onclick = () => {
      avatar = img.src;
      document.querySelectorAll('.avatar').forEach(a => a.classList.remove('selected'));
      img.classList.add('selected');
    };
    container.appendChild(img);
  }
}

/* ================= NAME ================= */

function goToName() {
  if (!avatar) {
    alert('Выберите аватар');
    return;
  }

  document.getElementById('avatar-screen').style.display = 'none';
  document.getElementById('name-screen').style.display = 'block';

  document.getElementById('name-title').textContent =
    mode === 'solo' ? 'Введите имя' : 'Введите данные команды';

  if (mode === 'team') {
    document.getElementById('teamName').style.display = 'block';
  }
}

function register() {
  const playerName = document.getElementById('playerName').value.trim();
  const teamName = document.getElementById('teamName').value.trim();

  if (!playerName) {
    alert('Введите имя');
    return;
  }

  if (mode === 'team' && !teamName) {
    alert('Введите название команды');
    return;
  }

  socket.emit('register_player', {
    mode,
    avatar,
    playerName,
    teamName
  });

  document.getElementById('name-screen').style.display = 'none';
  document.getElementById('lobby-screen').style.display = 'block';
}

/* ================= LOBBY ================= */

socket.on('lobby_update', players => {
  const list = document.getElementById('players');
  list.innerHTML = '';

  players.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.mode === 'solo'
      ? `🎮 ${p.playerName}`
      : `👥 ${p.teamName} — ${p.playerName}`;
    list.appendChild(li);
  });
});
