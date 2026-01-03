const socket = io();

document.getElementById("startBtn").onclick = () => {
  const name = document.getElementById("name").value;
  const avatar = document.querySelector("input[name='avatar']:checked")?.value;

  if (!name || !avatar) return alert("Введите имя и выберите аватар");

  socket.emit("joinGame", { name, avatar });
};

socket.on("waiting", () => {
  document.getElementById("status").innerText = "Ожидание начала игры…";
});

socket.on("question", (q) => {
  document.getElementById("status").innerText = q.question;
});
