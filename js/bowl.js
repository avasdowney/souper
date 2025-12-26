function createBowlElement(laneIndex) {
    const bowl = document.createElement('div');
    bowl.className = 'soup-bowl';
    bowl.textContent = '🥣';
    document.getElementById(`lane-${laneIndex}`).querySelector('.customer-zone').appendChild(bowl);
    return bowl;
}
