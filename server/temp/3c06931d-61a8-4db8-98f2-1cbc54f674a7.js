function minCostClimbingStairs(cost) {
    let downOne = 0, downTwo = 0;
    for (let i = 2; i <= cost.length; i++) {
        let temp = Math.min(downOne + cost[i - 1], downTwo + cost[i - 2]);
        downTwo = downOne;
        downOne = temp;
    }
    return downOne;
}

const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split('\n');
if (lines.length >= 2) {
    const cost = lines[1].trim().split(' ').map(Number);
    console.log(minCostClimbingStairs(cost).toString());
}