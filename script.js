const startScreen = document.querySelector(".start-screen");
const startBtn = document.querySelector("#startButton");
const scores = document.querySelector(".score-container");
const currentScoreDisplay = document.querySelector("#current-score");
const highScoreDisplay = document.querySelector("#high-score");
const gameArea = document.querySelector(".game-container");
const gameOverScreen = document.querySelector(".gameover-screen");
const restartBtn = document.querySelector("#restartButton");

let currentScore = 0;
let highScore = localStorage.getItem("lastHighScore") || 0 + "0";
let playGame = true;

highScoreDisplay.textContent = highScore;

let snake = {
  row: 8,
  col: 10,
  directionX: 0,
  directionY: 0,
  body: [],
};

const foodDiv = createGameElement("food");
const snakeDiv = createGameElement("snake");

function createGameElement(className) {
  const element = document.createElement("div");
  element.classList.add(className);
  return element;
}

document.addEventListener("keydown", handleArrowKeys);

function handleArrowKeys(e) {
  if (!playGame) return;

  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  const newDirection = directions[e.key];

  if (
    newDirection &&
    (newDirection.x !== -snake.directionX ||
      newDirection.y !== -snake.directionY)
  ) {
    setSnakeDirection(newDirection.x, newDirection.y);
  }
}

function setSnakeDirection(x, y) {
  snake.directionX = x;
  snake.directionY = y;
}

function drawSnake() {
  snake.row += snake.directionY;
  snake.col += snake.directionX;

  if (checkCollisionWithFood()) {
    handleFoodCollision();
  }

  snakeDiv.style.gridRow = snake.row;
  snakeDiv.style.gridColumn = snake.col;

  gameArea.appendChild(snakeDiv);

  checkCollisions();
}

function handleFoodCollision() {
  currentScore++;
  currentScoreDisplay.textContent = currentScore;
  changeFoodPosition();
}

function changeFoodPosition() {
  const foodRow = Math.floor(Math.random() * 30) + 1;
  const foodCol = Math.floor(Math.random() * 30) + 1;

  foodDiv.style.gridRow = foodRow;
  foodDiv.style.gridColumn = foodCol;
}

function drawFood() {
  changeFoodPosition();
  gameArea.appendChild(foodDiv);
}

function checkCollisionWithFood() {
  return (
    snake.row === parseInt(foodDiv.style.gridRow) &&
    snake.col === parseInt(foodDiv.style.gridColumn)
  );
}

function checkCollisions() {
  if (snake.row < 1 || snake.row > 30 || snake.col < 1 || snake.col > 30) {
    gameOver();
  }
}

startBtn.addEventListener("click", startGame);

function startGame() {
  startScreen.style.display = "none";
  scores.style.display = "flex";
  gameArea.style.display = "grid";
  drawFood();
  drawSnake();
}

function gameOver() {
  playGame = false;
  gameOverScreen.style.display = "flex";
  scores.style.display = "none";
  gameArea.style.display = "none";

  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreDisplay.textContent = highScore;
  }

  localStorage.setItem("lastHighScore", highScore);
}

restartBtn.addEventListener("click", resetGame);

function resetGame() {
  currentScore = 0;
  currentScoreDisplay.textContent = currentScore;

  playGame = true;
  snake = { row: 8, col: 10, directionX: 0, directionY: 0, body: [] };

  gameArea.innerHTML = "";

  gameOverScreen.style.display = "none";
  scores.style.display = "flex";

  startGame();
}

let drawSnakeInterval = setInterval(drawSnake, 125);

setTimeout(() => {
  startScreen.style.transform = "scale(1)";
}, 130);