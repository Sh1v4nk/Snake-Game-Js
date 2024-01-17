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
  const newHead = {
    row: snake.row + snake.directionY,
    col: snake.col + snake.directionX,
  };

  updateBodyPosition();

  snake.row = newHead.row;
  snake.col = newHead.col;

  if (checkCollisionWithFood()) {
    handleFoodCollision();
  }

  updateSnakeAppearance();
  gameArea.appendChild(snakeDiv);

  checkCollisions();
}

function updateBodyPosition() {
  for (let i = snake.body.length - 1; i >= 0; i--) {
    const currentBodyPart = snake.body[i];

    if (i === 0) {
      currentBodyPart.style.gridRow = snake.row;
      currentBodyPart.style.gridColumn = snake.col;
    } else {
      const previousBodyPart = snake.body[i - 1];
      currentBodyPart.style.gridRow = previousBodyPart.style.gridRow;
      currentBodyPart.style.gridColumn = previousBodyPart.style.gridColumn;
    }
  }
}

function handleFoodCollision() {
  currentScore++;
  currentScoreDisplay.textContent = currentScore;

  const newBodyPart = createGameElement("snake");
  newBodyPart.style.gridRow = snake.row;
  newBodyPart.style.gridColumn = snake.col;

  snake.body.unshift(newBodyPart);
  gameArea.appendChild(newBodyPart);

  changeFoodPosition();
}

function updateSnakeAppearance() {
  snakeDiv.style.gridRow = snake.row;
  snakeDiv.style.gridColumn = snake.col;
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

  for (let i = 1; i < snake.body.length; i++) {
    if (
      snake.row === parseInt(snake.body[i].style.gridRow) &&
      snake.col === parseInt(snake.body[i].style.gridColumn)
    ) {
      gameOver();
    }
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
    localStorage.setItem("lastHighScore", highScore);
  }
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
