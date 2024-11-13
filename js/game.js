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
}

// Initialize or reset game
function startGame() {
    board.fill(null);
    squares.forEach(square => {
        square.textContent = '';
        square.classList.remove('hover-x', 'hover-o');
        square.addEventListener('mouseover', addHoverEffect);
        square.addEventListener('mouseout', removeHoverEffect);
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

// Hover effect based on current player
function addHoverEffect(event) {
    if (!event.target.textContent) {
        event.target.classList.add(currentPlayer === 'X' ? 'hover-x' : 'hover-o');
    }
}

function removeHoverEffect(event) {
    event.target.classList.remove('hover-x', 'hover-o');
}

// Handle click on a square
function handleSquareClick(event) {
    const index = event.target.getAttribute('data-index');

    if (!board[index] && gameActive) {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.remove('hover-x', 'hover-o');

        if (checkWin()) {
            gameActive = false;
            if (currentPlayer === 'X') {
                playerXWins++;
            } else {
                playerOWins++;
            }
            updateScores();
            showGameOverModal(`${currentPlayer} Wins!`);
        } else if (board.every(cell => cell)) {
            gameActive = false;
            showGameOverModal("It's a Draw!");
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateActivePlayer(); // Update the active player display
        }
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

// Event listeners
squares.forEach(square => square.addEventListener('click', handleSquareClick));
resetButton.addEventListener('click', resetGame);
startButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', startGame); // Start new game when button is clicked

// Start initial game
startGame();
