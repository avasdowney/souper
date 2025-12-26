// Game constants
const GAME_CONSTANTS = {
    COLLISION_THRESHOLD: 50,  // pixels
    RIGHT_EDGE_BOUNDARY: 900, // pixels
    OFF_SCREEN_LEFT: -50      // pixels
};

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
    spawnIntervalId: null     // Store interval ID for cleanup
};

// Key mappings for lanes
const keyMap = {
    'a': 0,
    's': 1,
    'd': 2,
    'f': 3
};

// Initialize game
function init() {
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
    }
    
    // Start game loop
    requestAnimationFrame(gameLoop);
    
    // Start customer spawning
    game.spawnIntervalId = setInterval(spawnCustomer, game.customerSpawnInterval);
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    const laneIndex = keyMap[e.key.toLowerCase()];
    if (laneIndex !== undefined && game.isRunning) {
        serveSoup(laneIndex);
    }
});

// Restart button
document.getElementById('restart-btn').addEventListener('click', () => {
    init();
});

// Serve soup in a lane
function serveSoup(laneIndex) {
    const player = document.getElementById(`player-${laneIndex}`);
    player.classList.add('serving');
    setTimeout(() => player.classList.remove('serving'), 300);
    
    // Create soup bowl
    const bowl = {
        element: createBowlElement(laneIndex),
        position: 80,
        lane: laneIndex
    };
    
    game.bowls[laneIndex].push(bowl);
}

// Create bowl element
function createBowlElement(laneIndex) {
    const bowl = document.createElement('div');
    bowl.className = 'soup-bowl';
    bowl.textContent = '🥣';
    document.getElementById(`lane-${laneIndex}`).querySelector('.customer-zone').appendChild(bowl);
    return bowl;
}

// Spawn a customer in a random lane
function spawnCustomer() {
    if (!game.isRunning) return;
    
    const laneIndex = Math.floor(Math.random() * 4);
    const customer = {
        element: createCustomerElement(laneIndex),
        position: 0,
        lane: laneIndex,
        timeRemaining: game.customerTimer,
        timerElement: null
    };
    
    // Add timer display
    const timerDiv = document.createElement('div');
    timerDiv.className = 'customer-timer';
    timerDiv.textContent = customer.timeRemaining;
    customer.element.appendChild(timerDiv);
    customer.timerElement = timerDiv;
    
    game.lanes[laneIndex].push(customer);
}

// Create customer element
function createCustomerElement(laneIndex) {
    const customer = document.createElement('div');
    customer.className = 'customer';
    customer.textContent = '🧍';
    document.getElementById(`lane-${laneIndex}`).querySelector('.customer-zone').appendChild(customer);
    return customer;
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = game.score;
}

// Game over
function gameOver() {
    game.isRunning = false;
    document.getElementById('final-score').textContent = game.score;
    document.getElementById('game-over').classList.add('show');
}

// Check collision between bowl and customer
function checkCollision(bowl, customer) {
    const bowlPos = bowl.position;
    const customerPos = customer.position;
    
    // Check if bowl has reached customer (within range)
    return Math.abs(bowlPos - customerPos) < GAME_CONSTANTS.COLLISION_THRESHOLD;
}

// Main game loop
let lastFrameTime = Date.now();
function gameLoop() {
    if (!game.isRunning) return;
    
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
    lastFrameTime = currentTime;
    
    // Update all lanes
    for (let laneIndex = 0; laneIndex < 4; laneIndex++) {
        // Update customers
        const customers = game.lanes[laneIndex];
        for (let i = customers.length - 1; i >= 0; i--) {
            const customer = customers[i];
            
            // Move customer forward
            customer.position += game.customerSpeed;
            customer.element.style.left = customer.position + 'px';
            
            // Update timer
            customer.timeRemaining -= deltaTime;
            if (customer.timerElement) {
                customer.timerElement.textContent = Math.ceil(customer.timeRemaining);
            }
            
            // Check if customer timer ran out
            if (customer.timeRemaining <= 0) {
                customer.element.classList.add('leaving');
                setTimeout(() => {
                    customer.element.remove();
                }, 1000);
                customers.splice(i, 1);
                gameOver();
                return;
            }
            
            // Check if customer reached the end (right side)
            if (customer.position > GAME_CONSTANTS.RIGHT_EDGE_BOUNDARY) {
                customer.element.remove();
                customers.splice(i, 1);
                gameOver();
                return;
            }
        }
        
        // Update soup bowls
        const bowls = game.bowls[laneIndex];
        for (let i = bowls.length - 1; i >= 0; i--) {
            const bowl = bowls[i];
            
            // Move bowl forward
            bowl.position -= game.bowlSpeed;
            bowl.element.style.left = bowl.position + 'px';
            
            // Check collision with customers
            let hitCustomer = false;
            for (let j = customers.length - 1; j >= 0; j--) {
                const customer = customers[j];
                if (checkCollision(bowl, customer)) {
                    // Customer served!
                    game.score += 10;
                    updateScore();
                    
                    // Remove customer
                    customer.element.remove();
                    customers.splice(j, 1);
                    
                    // Remove bowl
                    bowl.element.remove();
                    bowls.splice(i, 1);
                    
                    hitCustomer = true;
                    break;
                }
            }
            
            // Remove bowl if it went off screen
            if (!hitCustomer && bowl.position < GAME_CONSTANTS.OFF_SCREEN_LEFT) {
                bowl.element.remove();
                bowls.splice(i, 1);
            }
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game when page loads
window.addEventListener('load', () => {
    init();
});
