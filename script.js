const startScreen = document.querySelector(".start-screen");
const startBtn = document.querySelector(".start-btn");
const scores = document.querySelector(".score-container");
const currentScoreDisplay = document.querySelector("#current-score");
const highScoreDisplay = document.querySelector("#high-score");
const gameArea = document.querySelector(".game-container");
const gameOverScreen = document.querySelector(".gameover-screen");
const restartBtn = document.querySelector(".restart-btn");

// Game state variables
let currentScore = 0;
let highScore = 0;
let playGame = true;

// Snake variables
let snakeRow = 8;
let snakeCol = 10;
let snakeDirectionX = 0;
let snakeDirectionY = 0;

// DOM elements for snake and food
const foodDiv = createGameElement("food");
const snakeDiv = createGameElement("snake");

setTimeout(() => {
  startScreen.style.transform = "scale(1)";
}, 130);

// Game Logic
if (playGame) {
  startBtn.addEventListener("click", startGame);
}

// Function to create game elements
function createGameElement(className) {
  const element = document.createElement("div");
  element.classList.add(className);
  return element;
}

// Function to start the game
function startGame() {
  startScreen.style.display = "none";
  scores.style.display = "flex";
  gameArea.style.display = "grid";
  drawFood();
  drawSnake();
}

document.addEventListener("keydown", handleArrowKeys);

function handleArrowKeys(e) {
  if (!playGame) return;

  // Determine the new direction
  let newDirectionX = 0;
  let newDirectionY = 0;

  switch (e.key) {
    case "ArrowUp":
      newDirectionY = -1;
      break;
    case "ArrowDown":
      newDirectionY = 1;
      break;
    case "ArrowLeft":
      newDirectionX = -1;
      break;
    case "ArrowRight":
      newDirectionX = 1;
      break;
  }

  // Check if the new direction is opposite to the current direction
  if (
    newDirectionX !== -snakeDirectionX ||
    newDirectionY !== -snakeDirectionY
  ) {
    setSnakeDirection(newDirectionX, newDirectionY);
  }
}

// Function to set snake direction
function setSnakeDirection(x, y) {
  snakeDirectionX = x;
  snakeDirectionY = y;
}

// Function to change food position
function changeFoodPosition() {
  const foodRow = Math.floor(Math.random() * 30) + 1;
  const foodCol = Math.floor(Math.random() * 30) + 1;

  foodDiv.style.gridRow = foodRow;
  foodDiv.style.gridColumn = foodCol;
}

// Function to draw food
function drawFood() {
  changeFoodPosition();
  gameArea.appendChild(foodDiv);
}

// Function to draw snake
function drawSnake() {
  snakeRow += snakeDirectionY;
  snakeCol += snakeDirectionX;

  // Check for collision with food
  if (
    snakeRow === parseInt(foodDiv.style.gridRow) &&
    snakeCol === parseInt(foodDiv.style.gridColumn)
  ) {
    currentScore++;
    currentScoreDisplay.textContent = currentScore;
    changeFoodPosition();
  }

  snakeDiv.style.gridRow = snakeRow;
  snakeDiv.style.gridColumn = snakeCol;

  gameArea.appendChild(snakeDiv);

  checkCollisions();
}

function checkCollisions() {
  if (snakeRow < 1 || snakeRow > 30 || snakeCol < 1 || snakeCol > 30) {
    gameOver();
  }
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
}

restartBtn.addEventListener("click", resetGame);

function resetGame() {
  console.log("reset");
}

// Set interval for drawing snake
let drawSnakeInterval = setInterval(drawSnake, 125);