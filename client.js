const socket = io();

socket.on("game_state", state => {
  document.getElementById("status").innerText =
    "Статус игры: " + state.status;
});

function join() {
  const name = document.getElementById("name").value;
  socket.emit("player_join", name);
}
