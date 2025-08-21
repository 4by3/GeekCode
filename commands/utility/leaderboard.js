const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ScoreManager = require('../../utils/scoreManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the current point leaderboard'),
    async execute(interaction) {
        try {
            const scores = await ScoreManager.getScores();
            const sortedScores = Object.entries(scores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);

            const leaderboard = sortedScores.map(([userId, score], index) => {
                let rank;
                if (score >= 5) {
                    rank = 'Locked In';
                } else if (score >= 3) {
                    rank = 'Grinding';
                } else if (score >= 1) {
                    rank = 'Coding';
                } else if (score >= -1) {
                    rank = 'Sleeping';
                } else if (score >= -3) {
                    rank = 'Slacking';
                } else {
                    rank = 'Geeked';
                }
                return `${index + 1}. <@${userId}> ${score} points: **${rank}**`
            }
            ).join('\n');

            const embed = new EmbedBuilder()
                .setTitle('🏆 Server Leaderboard')
                .setDescription(leaderboard || 'No scores yet!')
                .setColor('#f28f0c')
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                allowedMentions: { parse: [] },
            });
            console.log(`${interaction.user.username} checked leaderboard`);
        } catch (error) {
            console.error('Error in leaderboard command:', error);
        }
    },
};