let lastFrameTime = Date.now();

function runGameLoop() {
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
                const timeoutId = setTimeout(() => {
                    customer.element.remove();
                }, GAME_CONSTANTS.CUSTOMER_LEAVE_DURATION);
                game.pendingTimeouts.push(timeoutId);
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
    
    requestAnimationFrame(runGameLoop);
}
