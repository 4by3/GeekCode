const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('geek')
		.setDescription('Geek'),
	async execute(interaction) {
		await interaction.reply(`I'm Geeking it!`);
	},
};
