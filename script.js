const startScreen = document.querySelector(".start-screen");
const startBtn = document.querySelector(".start-btn");
const scores = document.querySelector(".score-container");
const currentScoreDisplay = document.querySelector("#current-score");
const highScoreDisplay = document.querySelector("#high-score");
const gameArea = document.querySelector(".game-container");

let currentScore = 0;
let highScore = 0;

let playGame = true;

if (playGame) {
  startBtn.addEventListener("click", startGame);
}

setTimeout(function () {
  startScreen.style.transform = "scale(1)";
}, 130);

function startGame() {
  startScreen.style.display = "none";
  scores.style.display = "flex";
  gameArea.style.display = "grid";
  draw();
}

function draw() {
  const snakeDiv = document.createElement("div");
  snakeDiv.classList.add("snake");

  const foodDiv = document.createElement("div");
  foodDiv.classList.add("food");

  const numColumns = 20;
  const numRows = 20;

  // Calculate random row and column for the food within the fixed grid dimensions
  const foodRow = (Math.floor(Math.random() * numRows) + 1) % numRows;
  const foodCol = (Math.floor(Math.random() * numColumns) + 1) % numColumns;
  
  foodDiv.style.gridRow = foodRow;
  foodDiv.style.gridColumn = foodCol;

  gameArea.appendChild(snakeDiv);
  gameArea.appendChild(foodDiv);
}
