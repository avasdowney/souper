function serveSoup(laneIndex) {
    const player = document.getElementById(`player-${laneIndex}`);
    player.classList.add('serving');
    setTimeout(() => player.classList.remove('serving'), GAME_CONSTANTS.SERVE_ANIMATION_DURATION);
    
    // Create soup bowl
    const bowl = {
        element: createBowlElement(laneIndex),
        position: GAME_CONSTANTS.BOWL_START_POSITION,
        lane: laneIndex
    };
    
    game.bowls[laneIndex].push(bowl);
}
