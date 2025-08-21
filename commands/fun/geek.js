const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('geek')
		.setDescription('Geek'),
	async execute(interaction) {
		try {
			await interaction.reply(`I'm Geeking it!`);
			console.log(`${interaction.user.username} used Geek`);
		} catch (error) {
			console.error('Error in geek command:', error);
		}

	},
};
