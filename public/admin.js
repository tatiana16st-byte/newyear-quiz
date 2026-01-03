const socket = io();

document.getElementById("startGame").onclick = () => {
  socket.emit("adminStart");
};

socket.on("rubricsList", (rubrics) => {
  const container = document.getElementById("rubrics");
  container.innerHTML = "";

  rubrics.forEach(r => {
    const btn = document.createElement("button");
    btn.innerText = r.title;
    btn.onclick = () => socket.emit("selectRubric", r.id);
    container.appendChild(btn);
  });
});
