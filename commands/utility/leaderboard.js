const { SlashCommandBuilder } = require('discord.js');
const ScoreManager = require('../../utils/scoreManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the current point leaderboard'),
    async execute(interaction) {
        const scores = ScoreManager.getScores();

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