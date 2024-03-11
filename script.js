const startScreen = document.querySelector(".start-screen");
const startBtn = document.querySelector("#startButton");
const scores = document.querySelector(".score-container");
const currentScoreDisplay = document.querySelector("#current-score");
const highScoreDisplay = document.querySelector("#high-score");
const gameArea = document.querySelector(".game-container");
const gameOverScreen = document.querySelector(".gameover-screen");
const restartBtn = document.querySelector("#restartButton");
const mobileKeysControl = document.querySelector(".mobile-controls");
const upButton = document.querySelector(".up-btn");
const downButton = document.querySelector(".down-btn");
const leftButton = document.querySelector(".left-btn");
const rightButton = document.querySelector(".right-btn");
const playPauseButton = document.querySelector(".play-pause");

// Game-related variables
let currentScore = 0;
let highScore = localStorage.getItem("lastHighScore") || 0 + "0"; // Defaulting highScore if it's falsy
let playGame = true;
let isPaused = false;

// Displaying initial high score
highScoreDisplay.textContent = highScore;

// Snake object representing the game state
let snake = {
  row: 8,
  col: 10,
  directionX: 0,
  directionY: 0,
  body: [],
};

// Checking if the device is mobile
function isMobileDevice() {
  return "ontouchstart" in window || navigator.msMaxTouchPoints;
}

// Updating the visibility of mobile controls based on the device
function updateMobileControlsVisibility() {
  mobileKeysControl.style.display = isMobileDevice() ? "grid" : "none";
}

// Creating game elements (food and snake)
const foodDiv = createGameElement("food");
const snakeDiv = createGameElement("snake");

// Function to create a game element with a specified class
function createGameElement(className) {
  const element = document.createElement("div");
  element.classList.add(className);
  return element;
}

// Event listeners for mobile control buttons
upButton.addEventListener("click", () => simulateKeyPress("ArrowUp") || simulateKeyPress("w"));
downButton.addEventListener("click", () => simulateKeyPress("ArrowDown") || simulateKeyPress("s"));
leftButton.addEventListener("click", () => simulateKeyPress("ArrowLeft") || simulateKeyPress("a"));
rightButton.addEventListener("click", () => simulateKeyPress("ArrowRight") || simulateKeyPress("d"));

// Function to simulate a key press event
function simulateKeyPress(key) {
  const event = new Event("keydown");
  event.key = key;
  document.dispatchEvent(event);
}

// Event listener for keyboard arrow keys
document.addEventListener("keydown", handleArrowKeys);

// Handling arrow key events
function handleArrowKeys(e) {
  if (isPaused) {
    alert("Game is paused! Resume to play.");
    return;
  }

  // Mapping arrow key and ASWD key inputs to directions
  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  if(e.key === "p") {
    togglePlayPause();
  }
  
  // Extracting the new direction based on the pressed key
  const newDirection = directions[e.key];

  // Checking if the new direction is valid and not opposite to the current direction
  if (
    newDirection &&
    (newDirection.x !== -snake.directionX ||
      newDirection.y !== -snake.directionY)
  ) {
    setSnakeDirection(newDirection.x, newDirection.y);
  }
}

// Function to set the snake direction
function setSnakeDirection(x, y) {
  snake.directionX = x;
  snake.directionY = y;
}

// Event listener for play/pause button
playPauseButton.addEventListener("click", togglePlayPause);

// Toggling play/pause state
function togglePlayPause() {
  if (isPaused) {
    // Resuming the game
    drawSnakeInterval = setInterval(drawSnake, 125);
    playPauseButton.querySelector(".pause-icon").style.display = "inline";
    playPauseButton.querySelector(".play-icon").style.display = "none";
  } else {
    // Pausing the game
    clearInterval(drawSnakeInterval);
    playPauseButton.querySelector(".pause-icon").style.display = "none";
    playPauseButton.querySelector(".play-icon").style.display = "inline";
  }

  isPaused = !isPaused;
}

// Function to draw the snake on the game grid
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

// Function to update the position of the snake's body
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

// Function to handle collision with food
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

// Function to update the appearance of the snake on the grid
function updateSnakeAppearance() {
  snakeDiv.style.gridRow = snake.row;
  snakeDiv.style.gridColumn = snake.col;
}

// Function to change the position of the food on the grid
function changeFoodPosition() {
  const foodRow = Math.floor(Math.random() * 30) + 1;
  const foodCol = Math.floor(Math.random() * 30) + 1;

  foodDiv.style.gridRow = foodRow;
  foodDiv.style.gridColumn = foodCol;
}

// Function to draw the food on the game grid
function drawFood() {
  changeFoodPosition();
  gameArea.appendChild(foodDiv);
}

// Function to check collision with food
function checkCollisionWithFood() {
  return (
    snake.row === parseInt(foodDiv.style.gridRow) &&
    snake.col === parseInt(foodDiv.style.gridColumn)
  );
}

// Function to check collisions with walls and the snake's body
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

// Event listener for the start button
startBtn.addEventListener("click", startGame);

let isGameRunning = false;

// Event listener for space key to reset or start the game
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (!isGameRunning) {
      resetGame();
    } else if (!playGame) {
      startGame();
    }
  }
});

// Function to start the game
function startGame() {
  isGameRunning = true;
  startScreen.style.display = "none";
  scores.style.display = "flex";
  gameArea.style.display = "grid";
  mobileKeysControl.style.display = "flex";
  updateMobileControlsVisibility();
  drawFood();
  drawSnake();
}

// Function to handle game over
function gameOver() {
  playGame = false;
  isGameRunning = false;
  gameOverScreen.style.display = "flex";
  scores.style.display = "none";
  gameArea.style.display = "none";
  mobileKeysControl.style.display = "none";

  // Updating and storing high score if the current score is higher
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreDisplay.textContent = highScore;
    localStorage.setItem("lastHighScore", highScore);
  }
}

// Event listener for restart button
restartBtn.addEventListener("click", resetGame);

// Function to reset the game state
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

// Setting up the interval for drawing the snake
let drawSnakeInterval = setInterval(drawSnake, 125);

// Adding a delay for the start screen animation
setTimeout(() => {
  startScreen.style.transform = "scale(1)";
}, 130);
