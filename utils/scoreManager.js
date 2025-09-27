const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/env');
const Score = require('../models/Score')

// Use mongoose to connect to mongodb
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    });

// Add point for a user
async function addPoint(userId) {
    try {
        // Find the user's current score
        const user = await Score.findOne({ userId });
        const currentScore = user ? user.score : 0;
        const newScore = Math.max(1, currentScore + 1);

        // Update or insert the user's score
        await Score.updateOne(
            { userId },
            { $set: { score: newScore } },
            { upsert: true }
        );

        console.log(`Point added for user ${userId}. New score: ${newScore}`);
        return newScore;
    } catch (error) {
        console.error(`Error adding point for user ${userId}:`, error.message);
        throw error;
    }
}

// Update scores for users who didn't click
async function deductPoints(clickedUsers) {
    try {
        // Get all users in the collection
        const users = await Score.find({}).toArray();

        // // Temporarily disabling deduct point
        // for (const user of users) {
        //     const userId = user.userId;
        //     if (!clickedUsers.has(userId)) {
        //         const newScore = Math.min(5, (user.score || 0) - 1);
        //         await Score.updateOne(
        //             { userId },
        //             { $set: { score: newScore } }
        //         );
        //         console.log(`Point deducted from user ${userId}. New score: ${newScore}`);
        //     }
        // }


    } catch (error) {
        console.error('Error deducting points:', error.message);
        throw error;
    }
}


// Get function
async function getScores() {
    try {
        const users = await Score.find({});
        const scores = {};
        users.forEach(user => {
            scores[user.userId] = user.score;
        });
        return scores;
    } catch (error) {
        console.error('Error fetching scores:', error.message);
        throw error;
    }
}

module.exports = {
    getScores,
    deductPoints,
    addPoint,
};