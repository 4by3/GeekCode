const schedule = require('node-schedule');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CHANNEL_ID } = require('../config/env');
const { deductPoints } = require('../utils/scoreManager');

function setupSchedules(client, dailyMessageRef, clickedUsers) {
    // Creation of button
    const rule = new schedule.RecurrenceRule();
    rule.hour = 6;
    rule.minute = 0;
    rule.second = 0;
    rule.tz = 'Australia/Sydney';

    // Removal of button
    const disableRule = new schedule.RecurrenceRule();
    disableRule.hour = 7;
    disableRule.minute = 30;
    disableRule.second = 0;
    disableRule.tz = 'Australia/Sydney';

    // Send button schedule
    schedule.scheduleJob(rule, async () => {
        // Reset clicked users
        clickedUsers.clear();

        // Send new daily message
        const channel = await client.channels.fetch(CHANNEL_ID).catch(error => {
            console.error('Error fetching channel:', error);
            return null;
        });
        if (channel) {
            try {
                const button = new ButtonBuilder()
                    .setCustomId('lock_in_button')
                    .setLabel('Lock In')
                    .setStyle(ButtonStyle.Primary);
                const row = new ActionRowBuilder().addComponents(button);

                dailyMessageRef.message = await channel.send({
                    content: 'Wake up! Click below before 7:30 to lock in',
                    components: [row],
                });
            } catch (error) {
                console.error('Error sending daily message:', error);
            }
        } else {
            console.error('Target channel not found. Please check the channel ID.');
        }
    });

    // Disable button schedule
    schedule.scheduleJob(disableRule, async () => {
        if (dailyMessageRef.message) {
            try {
                const button = new ButtonBuilder()
                    .setCustomId('lock_in_button')
                    .setLabel('Lock In')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);
                const row = new ActionRowBuilder().addComponents(button);
                await dailyMessageRef.message.edit({ components: [row] });
                // deduct points
                deductPoints(clickedUsers);
            } catch (error) {
                console.error('Error disabling button:', error);
            }
        }
    });
}

module.exports = { setupSchedules };