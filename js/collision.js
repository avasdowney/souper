function checkCollision(bowl, customer) {
    const bowlPos = bowl.position;
    const customerPos = customer.position;
    
    // Check if bowl has reached customer (within range)
    return Math.abs(bowlPos - customerPos) < GAME_CONSTANTS.COLLISION_THRESHOLD;
}
