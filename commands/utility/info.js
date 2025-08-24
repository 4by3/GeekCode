const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { CHANNEL_ID, VOICE_CHANNEL_ID } = require('../../config/env');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Bot information'),
	async execute(interaction) {
		try {
            description = 
            `Bot made for LeetCode. Unfinished, main feature at the moment is for the 6am session.\n
            Join <#${VOICE_CHANNEL_ID}> between 6am-7:30am to be part of the leaderboard system.\n
            If it doesn't work, may be due to web service being down. It's using Render's free web service which resets randomly.\n
            You will be able to see me in <#${CHANNEL_ID}>, hope to see you there :)`
			const embed = new EmbedBuilder()
                .setTitle('Info')
                .setDescription(description)
                .setColor('#00ab1c')
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                allowedMentions: { parse: [] },
                ephemeral: true,
            });
            console.log(`${interaction.user.username} checked info`);
		} catch (error) {
			console.error('Error in info command:', error);
		}

	},
};
