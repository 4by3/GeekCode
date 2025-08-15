const fs = require('node:fs');
const path = require('node:path');

const scoresPath = path.join(__dirname, '../scores.json');
let scores = {};

// Load scores from file or initialize empty object
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

// Save scores to file
function saveScores() {
    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
}

// Update scores for users who didn't click
function updateScoresForNonClickers(clickedUsers, clientId) {
    for (const userId in scores) {
        if (!clickedUsers.has(userId) && userId !== clientId) {
            scores[userId] = Math.max(-7, (scores[userId] || 0) - 1);
        }
    }
    saveScores();
}

// Add point for a user
function addPoint(userId) {
    scores[userId] = Math.min(7, (scores[userId] || 0) + 1);
    saveScores();
    return scores[userId];
}

module.exports = {
    scores,
    saveScores,
    updateScoresForNonClickers,
    addPoint,
};