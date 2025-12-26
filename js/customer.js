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

function createCustomerElement(laneIndex) {
    const customer = document.createElement('div');
    customer.className = 'customer';
    customer.textContent = '🧍';
    document.getElementById(`lane-${laneIndex}`).querySelector('.customer-zone').appendChild(customer);
    return customer;
}
