const socket = io();

socket.on("game_state", state => {
  document.getElementById("state").innerText =
    JSON.stringify(state, null, 2);
});

function start() {
  socket.emit("admin_start");
}

function end() {
  socket.emit("admin_end");
}
