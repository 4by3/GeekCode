const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jeet')
		.setDescription('Jeet'),
	async execute(interaction) {
		await interaction.reply(`I'm Jeeting it!`);
	},
};
