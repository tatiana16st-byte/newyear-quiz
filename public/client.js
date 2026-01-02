const socket = io();

const rubric = document.getElementById('rubric');
const question = document.getElementById('question');
const answersBlock = document.getElementById('answers');
const result = document.getElementById('result');
const image = document.getElementById('image');

let answered = false;

socket.on('new_question', (data) => {
  answered = false;
  result.textContent = '';
  rubric.textContent = data.rubricTitle;
  question.textContent = data.question;

  if (data.imagePath) {
    image.src = data.imagePath;
    image.hidden = false;
  } else {
    image.hidden = true;
  }

  answersBlock.innerHTML = '';

  for (let key in data.options) {
    const btn = document.createElement('button');
    btn.textContent = ${key}: ${data.options[key]};
    btn.onclick = () => sendAnswer(key);
    answersBlock.appendChild(btn);
  }
});

function sendAnswer(answer) {
  if (answered) return;
  answered = true;
  socket.emit('submit_answer', answer);
}

socket.on('answer_result', (data) => {
  if (data.correct) {
    result.textContent = '✅ Правильно!';
  } else {
    result.textContent = ❌ Неправильно. Правильный ответ: ${data.correctText};
  }
});

socket.on('game_finished', () => {
  question.textContent = 'Игра завершена 🎉';
  answersBlock.innerHTML = '';
});
