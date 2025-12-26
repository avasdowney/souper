// Game state
const game = {
    score: 0,
    isRunning: true,
    lanes: [[], [], [], []],  // Array of customers in each lane
    bowls: [[], [], [], []],  // Array of soup bowls in each lane
    customerSpeed: 0.5,       // pixels per frame
    bowlSpeed: 3,             // pixels per frame
    customerSpawnInterval: 2000, // milliseconds
    customerTimer: 30,        // seconds before customer leaves
    lastSpawnTime: 0,
    spawnIntervalId: null,    // Store interval ID for cleanup
    pendingTimeouts: []       // Store timeout IDs for cleanup
};

function updateScore() {
    document.getElementById('score').textContent = game.score;
}

function resetGame() {
    game.score = 0;
    game.isRunning = true;
    game.lanes = [[], [], [], []];
    game.bowls = [[], [], [], []];
    game.lastSpawnTime = Date.now();
    updateScore();
    document.getElementById('game-over').classList.remove('show');
    
    // Clear existing interval if any
    if (game.spawnIntervalId) {
        clearInterval(game.spawnIntervalId);
        game.spawnIntervalId = null;
    }
    
    // Clear any pending timeouts
    game.pendingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    game.pendingTimeouts = [];
}

function gameOver() {
    game.isRunning = false;
    
    // Clear spawn interval to prevent more customers
    if (game.spawnIntervalId) {
        clearInterval(game.spawnIntervalId);
        game.spawnIntervalId = null;
    }
    
    document.getElementById('final-score').textContent = game.score;
    document.getElementById('game-over').classList.add('show');
}
