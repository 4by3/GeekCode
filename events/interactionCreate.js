const { Events, MessageFlags } = require('discord.js');
const { addPoint } = require('../utils/scoreManager');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, dailyMessageRef, clickedUsers) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                }
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'daily_point_button' && interaction.message.id === dailyMessageRef.message?.id) {
                try {
                    if (clickedUsers.has(interaction.user.id)) {
                        await interaction.reply({ content: 'You have already claimed your point for today!', ephemeral: true });
                        return;
                    }

                    clickedUsers.add(interaction.user.id);
                    const newScore = addPoint(interaction.user.id);
                    await interaction.reply({ content: `${interaction.user.username} has locked in!` });
                    console.log(`Point added for user ${interaction.user.id}. New score: ${newScore}`);
                } catch (error) {
                    console.error('Error handling button interaction:', error);
                    await interaction.reply({ content: 'There was an error processing your click!', ephemeral: true });
                }
            }
        }
    },
};