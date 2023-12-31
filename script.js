const startScreen = document.querySelector(".start-screen");
const startBtn = document.querySelector(".start-btn");
const scores = document.querySelector(".score-container");
const currentScoreDisplay = document.querySelector("#current-score");
const highScoreDisplay = document.querySelector("#high-score");
const gameArea = document.querySelector(".game-container");

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
const foodDiv = document.createElement("div");
foodDiv.classList.add("food");

const snakeDiv = document.createElement("div");
snakeDiv.classList.add("snake");

// Event listener for arrow keys
document.addEventListener("keydown", handleArrowKeys);

// Initial animation for start screen
setTimeout(function () {
  startScreen.style.transform = "scale(1)";
}, 130);

// Game Logic
if (playGame) {
  startBtn.addEventListener("click", startGame);
}

// Function to start the game
function startGame() {
  startScreen.style.display = "none";
  scores.style.display = "flex";
  gameArea.style.display = "grid";
  drawFood();
  drawSnake();
}

// Function to handle arrow key events
function handleArrowKeys(e) {
  if (!playGame) return; // Don't handle arrow keys if the game is not active

  switch (e.key) {
    case "ArrowUp":
      setSnakeDirection(0, -1);
      break;
    case "ArrowDown":
      setSnakeDirection(0, 1);
      break;
    case "ArrowLeft":
      setSnakeDirection(-1, 0);
      break;
    case "ArrowRight":
      setSnakeDirection(1, 0);
      break;
  }
}

// Function to set snake direction
function setSnakeDirection(x, y) {
  snakeDirectionX = x;
  snakeDirectionY = y;
}

function changeFoodPosition() {
  const foodRow = Math.floor(Math.random() * 20) + 1;
  const foodCol = Math.floor(Math.random() * 20) + 1;

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
  if (snakeRow === parseInt(foodDiv.style.gridRow) && snakeCol === parseInt(foodDiv.style.gridColumn)) {
    currentScore ++;
    currentScoreDisplay.textContent = currentScore;
    changeFoodPosition();
  }

  snakeDiv.style.gridRow = snakeRow;
  snakeDiv.style.gridColumn = snakeCol;

  gameArea.appendChild(snakeDiv);
}

setInterval(drawSnake, 125);