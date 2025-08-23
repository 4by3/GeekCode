const { MongoClient } = require('mongodb');
const { MONGODB_URI } = require('../config/env');
const client = new MongoClient(MONGODB_URI);

let db, scoresCollection;

// Initialize MongoDB connection
async function initializeMongoDB() {
    try {
        await client.connect();
        db = client.db('discord_bot');
        scoresCollection = db.collection('scores');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

initializeMongoDB();


// Add point for a user
async function addPoint(userId) {
    try {
        // Find the user's current score
        const user = await scoresCollection.findOne({ userId });
        const currentScore = user ? user.score : 0;
        const newScore = Math.max(1, Math.min(5, currentScore + 1));

        // Update or insert the user's score
        await scoresCollection.updateOne(
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
        const users = await scoresCollection.find({}).toArray();

        for (const user of users) {
            const userId = user.userId;
            if (!clickedUsers.has(userId)) {
                const newScore = (user.score || 0) - 1;
                await scoresCollection.updateOne(
                    { userId },
                    { $set: { score: newScore } }
                );
                console.log(`Point deducted from user ${userId}. New score: ${newScore}`);
            }
        }
    } catch (error) {
        console.error('Error deducting points:', error.message);
        throw error;
    }
}


// Get function
async function getScores() {
    try {
        const users = await scoresCollection.find({}).toArray();
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