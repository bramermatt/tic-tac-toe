// Select elements
const squares = document.querySelectorAll('.square');
const resetButton = document.getElementById('resetGame');
const startButton = document.getElementById('startGame');
const playerXScoreDisplay = document.querySelector('.playerX h2');
const playerOScoreDisplay = document.querySelector('.playerO h2');
const activePlayerDisplay = document.getElementById('active-player'); // Active player element
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const newGameButton = document.getElementById('newGameButton');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let playerXWins = 0;
let playerOWins = 0;
let gameActive = false;

// Update scoreboard
function updateScores() {
    playerXScoreDisplay.textContent = `X Wins: ${playerXWins}`;
    playerOScoreDisplay.textContent = `O Wins: ${playerOWins}`;
}

// Update the active player display
function updateActivePlayer() {
    activePlayerDisplay.textContent = `Active Player: ${currentPlayer}`;
    setActivePlayer(currentPlayer); // Update the body background color
}

// Initialize or reset game
function startGame() {
    board.fill(null);
    squares.forEach(square => {
        square.textContent = '';
        square.classList.remove('hover-x', 'hover-o');
        square.addEventListener('mouseover', addHoverEffect);
        square.addEventListener('mouseout', removeHoverEffect);
        square.addEventListener('click', handleSquareClick, { once: true });
    });
    currentPlayer = 'X';
    gameActive = true;
    updateScores();
    updateActivePlayer(); // Display the active player
    gameOverModal.style.display = 'none'; // Hide the modal when a new game starts
}

// Reset score and start a new game
function resetGame() {
    playerXWins = 0;
    playerOWins = 0;
    startGame();
}

// Update cursor based on current player
function updateCursor() {
    if (currentPlayer === 'X') {
        document.body.style.cursor = 'url("../img/x-solid.svg"), auto'; // Custom cursor for 'X'
    } else {
        document.body.style.cursor = 'url("../img/o-solid.svg"), auto'; // Custom cursor for 'O'
    }
}

// Function to toggle the player, update cursor, and display the active player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCursor();
    updateActivePlayer(); // Update the active player display
}

// Hover effect based on current player
function addHoverEffect(event) {
    const square = event.target;
    if (!square.textContent) {
        square.classList.add(currentPlayer === 'X' ? 'hover-x' : 'hover-o');
    }
}

function removeHoverEffect(event) {
    const square = event.target;
    square.classList.remove('hover-x', 'hover-o');
}

// Handle click on a square
function handleSquareClick(event) {
    const square = event.target;
    const squareIndex = Array.from(squares).indexOf(square);

    if (board[squareIndex] || !gameActive) {
        return;
    }

    board[squareIndex] = currentPlayer;
    square.textContent = currentPlayer;
    square.classList.remove('hover-x', 'hover-o');

    if (checkWin()) {
        gameActive = false;
        gameOverMessage.textContent = `${currentPlayer} Wins!`;
        gameOverModal.style.display = 'block';
        if (currentPlayer === 'X') {
            playerXWins++;
        } else {
            playerOWins++;
        }
        updateScores();
    } else if (board.every(cell => cell)) {
        gameActive = false;
        gameOverMessage.textContent = `It's a Draw!`;
        gameOverModal.style.display = 'block';
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateActivePlayer();
    }
}

// Check for win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    return winPatterns.some(pattern => 
        pattern.every(index => board[index] === currentPlayer)
    );
}

// Show game over modal
function showGameOverModal(message) {
    gameOverMessage.textContent = message;
    gameOverModal.style.display = 'flex'; // Show the modal
}

// Set active player background color
function setActivePlayer(player) {
    const body = document.body;
    body.classList.remove('active-x', 'active-o');
    if (player === 'X') {
        body.classList.add('active-x');
    } else if (player === 'O') {
        body.classList.add('active-o');
    }
}

// Event listeners
resetButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', startGame);

// Start initial game
startGame();
