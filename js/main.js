function init() {
    resetGame();
    
    // Start game loop
    requestAnimationFrame(runGameLoop);
    
    // Start customer spawning
    game.spawnIntervalId = setInterval(spawnCustomer, game.customerSpawnInterval);
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    const laneIndex = KEY_MAP[e.key.toLowerCase()];
    if (laneIndex !== undefined && game.isRunning) {
        serveSoup(laneIndex);
    }
});

// Restart button
document.getElementById('restart-btn').addEventListener('click', () => {
    init();
});

// Start the game when page loads
window.addEventListener('load', () => {
    init();
});
