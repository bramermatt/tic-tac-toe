// Select elements
const gameBoard = document.querySelector('.gameBoard');
const gameTabs = document.querySelectorAll('.game-tab');
const resetButton = document.getElementById('resetGame');
const startButton = document.getElementById('startGame');
const playerScoreDisplays = {
    X: document.querySelector('.playerX h2'),
    O: document.querySelector('.playerO h2'),
    Y: document.querySelector('.playerY h2')
};
const playerYScore = document.querySelector('.playerY');
const activePlayerDisplay = document.getElementById('active-player');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const newGameButton = document.getElementById('newGameButton');

const gameModes = {
    3: { size: 3, players: ['X', 'O'] },
    4: { size: 4, players: ['X', 'O', 'Y'] }
};

let gameMode = gameModes[3];
let squares = [];
let board = [];
let currentPlayer = 'X';
let playerWins = { X: 0, O: 0, Y: 0 };
let gameActive = false;

function updateScores() {
    gameMode.players.forEach(player => {
        playerScoreDisplays[player].textContent = `${player} Wins: ${playerWins[player]}`;
    });
    playerYScore.hidden = !gameMode.players.includes('Y');
}

function updateActivePlayer() {
    activePlayerDisplay.textContent = `Active Player: ${currentPlayer}`;
    setActivePlayer(currentPlayer);
}

function createBoard() {
    gameBoard.style.setProperty('--board-size', gameMode.size);
    gameBoard.classList.toggle('four-by-four', gameMode.size === 4);
    gameBoard.innerHTML = Array.from({ length: gameMode.size ** 2 }, (_, index) =>
        `<button class="square" type="button" data-index="${index}" aria-label="Square ${index + 1}"></button>`
    ).join('');
    squares = Array.from(gameBoard.querySelectorAll('.square'));

    squares.forEach(square => {
        square.addEventListener('mouseover', addHoverEffect);
        square.addEventListener('mouseout', removeHoverEffect);
        square.addEventListener('click', handleSquareClick);
    });
}

// Initialize or reset game
function startGame() {
    board = Array(gameMode.size ** 2).fill(null);
    createBoard();
    currentPlayer = 'X';
    gameActive = true;
    updateScores();
    updateCursor();
    updateActivePlayer();
    gameOverModal.style.display = 'none';
}

// Reset scores and start a new game
function resetGame() {
    playerWins = { X: 0, O: 0, Y: 0 };
    startGame();
}

function updateCursor() {
    if (currentPlayer === 'X') {
        document.body.style.cursor = 'url("../img/x-solid.svg"), auto';
    } else if (currentPlayer === 'O') {
        document.body.style.cursor = 'url("../img/o-solid.svg"), auto';
    } else {
        document.body.style.cursor = 'default';
    }
}

function switchPlayer() {
    const currentPlayerIndex = gameMode.players.indexOf(currentPlayer);
    currentPlayer = gameMode.players[(currentPlayerIndex + 1) % gameMode.players.length];
    updateCursor();
    updateActivePlayer();
}

function addHoverEffect(event) {
    const square = event.target;
    if (!square.textContent && gameActive) {
        square.classList.add(`hover-${currentPlayer.toLowerCase()}`);
    }
}

function removeHoverEffect(event) {
    event.target.classList.remove('hover-x', 'hover-o', 'hover-y');
}

function handleSquareClick(event) {
    const square = event.target;
    const squareIndex = Number(square.dataset.index);

    if (board[squareIndex] || !gameActive) {
        return;
    }

    board[squareIndex] = currentPlayer;
    square.textContent = currentPlayer;
    square.classList.remove('hover-x', 'hover-o', 'hover-y');

    if (checkWin()) {
        gameActive = false;
        gameOverMessage.textContent = `${currentPlayer} Wins!`;
        gameOverModal.style.display = 'block';
        playerWins[currentPlayer]++;
        updateScores();
    } else if (board.every(cell => cell)) {
        gameActive = false;
        gameOverMessage.textContent = "It's a Draw!";
        gameOverModal.style.display = 'block';
    } else {
        switchPlayer();
    }
}

function checkWin() {
    const { size } = gameMode;
    const winPatterns = [];

    for (let index = 0; index < size; index++) {
        winPatterns.push(Array.from({ length: size }, (_, column) => index * size + column));
        winPatterns.push(Array.from({ length: size }, (_, row) => row * size + index));
    }

    winPatterns.push(Array.from({ length: size }, (_, index) => index * size + index));
    winPatterns.push(Array.from({ length: size }, (_, index) => index * size + (size - 1 - index)));

    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === currentPlayer)
    );
}

function setActivePlayer(player) {
    const body = document.body;
    body.classList.remove('active-x', 'active-o', 'active-y');
    body.classList.add(`active-${player.toLowerCase()}`);
}

resetButton.addEventListener('click', resetGame);
startButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', startGame);

gameTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        gameMode = gameModes[Number(tab.dataset.size)];
        gameTabs.forEach(gameTab => {
            const isActive = gameTab === tab;
            gameTab.classList.toggle('active', isActive);
            gameTab.setAttribute('aria-selected', isActive);
        });
        resetGame();
    });
});

startGame();

document.getElementById('historyButton').addEventListener('click', function() {
    document.getElementById('historyModal').style.display = 'block';
});

document.getElementById('closeHistoryButton').addEventListener('click', function() {
    document.getElementById('historyModal').style.display = 'none';
});
