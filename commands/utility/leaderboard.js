const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the current point leaderboard'),
    async execute(interaction) {
        const scoresPath = path.join(__dirname, '../../scores.json');
        let scores = {};
        if (fs.existsSync(scoresPath)) {
            scores = JSON.parse(fs.readFileSync(scoresPath));
        }

        const sortedScores = Object.entries(scores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        const leaderboard = sortedScores.map(([userId, score], index) => 
            `${index + 1}. <@${userId}>: ${score} points`
        ).join('\n');

        await interaction.reply({
            content: leaderboard || 'No scores yet!'
        });
    },
};