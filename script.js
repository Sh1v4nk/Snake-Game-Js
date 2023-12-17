const startScreen = document.querySelector(".start-screen");
const startBtn = document.querySelector(".start-button");
const scores = document.querySelector(".scores");
const currentScoreDisplay = document.querySelector("#current-score");
const highScoreDisplay = document.querySelector("#high-score");
const gameArea = document.querySelector(".game-container");

let currentScore = 0;
let highScore = 0;

let playGame = true;

if (playGame) {
  startBtn.addEventListener("click", startGame);
}

setTimeout(function() {
  startScreen.style.transform = 'scale(1)';
}, 130);

function startGame() {
  startScreen.style.display = "none";
  scores.style.display = "flex";
  gameArea.style.display = "block";
  draw();
}

function draw() {
  const snakeDiv = document.createElement("div");
  snakeDiv.classList.add("snake");

  const foodDiv = document.createElement("div");
  foodDiv.classList.add("food");
  
  gameArea.appendChild(snakeDiv);
  gameArea.appendChild(foodDiv);
}
