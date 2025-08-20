const fs = require('node:fs');
const path = require('node:path');

const scoresPath = path.join(__dirname, '../scores.json');
let scores = {};

// Load scores from file or initialize empty object
function loadScores() {
    if (fs.existsSync(scoresPath)) {
        try {
            const data = fs.readFileSync(scoresPath, 'utf8');
            if (data.trim()) {
                scores = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error parsing scores.json, initializing empty scores:', error.message);
            scores = {};
            fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
        }
    }
}

loadScores();

// Save scores to file
function saveScores() {
    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
}

// Add point for a user
function addPoint(userId) {
    newScore = Math.max(1, Math.min(5, (scores[userId] || 0) + 1));
    scores[userId] = newScore
    console.log(`Point added for user ${userId}. New score: ${newScore}`);
    saveScores();
    return scores[userId];
}

// Update scores for users who didn't click
function deductPoints(clickedUsers) {
    for (const userId in scores) {
        if (!clickedUsers.has(userId)) {
            newScore = (scores[userId] || 0) - 1;
            scores[userId] = newScore;
            console.log(`Point deducted from user ${userId}. New score: ${newScore}`);
        }
    }
    saveScores();
}


function getScores() {
    return { ...scores };
}

module.exports = {
    getScores,
    saveScores,
    deductPoints,
    addPoint,
};